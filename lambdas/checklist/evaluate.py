import json
import uuid
import logging

import boto3
import psycopg2

from openai import OpenAI

from config import Config
from client.github import GithubClient
from utils.compression import compress_file_content
from utils.token import decrypt_github_access_token

# Logger
logger = logging.getLogger('publish_generation')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# DynamoDB
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
criterion_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Criterion')

# Postgres
db_conn = None
db_cursor = None

chat_client = OpenAI()


def connect_to_db():
    """
    Reconnects to the database.
    """
    logger.info("Connecting to db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_github_access_token_from_checklist_id(checklist_id: str) -> str:
    """
    Gets the github access token from the checklist id.

    :param checklist_: Unique identifier for the checklist.
    :return: The github access token.
    """
    logger.info("Getting the github access token from checklist id...")
    sql = """
        SELECT company.github_access_token
        FROM company
        JOIN position ON company.id = position.company_id
        JOIN checklist ON position.id = checklist.position_id
        WHERE checklist.id = '%s';
        """
    try:
        db_cursor.execute(sql % (checklist_id))
        result = db_cursor.fetchone()
        if result and result[0]:
            return decrypt_github_access_token(result[0])
        else:
            return None
    except Exception as e:
        logger.error(f"Error getting github access token from postgres: {e}")
        raise RuntimeError(f"Error getting github access token from postgres: {e}")


def get_criteria_from_dynamodb(checklist_id: str) -> list:
    """
    Retrieves the full message criteria for a checklist.

    :param checklist_id: The ID of the checklist.
    :return: A list of criteria with keywords and message
    """
    logger.info("Getting the criteria from db...")
    try:
        response = criterion_table.query(
            IndexName='ChecklistIdIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('checklist_id').eq(checklist_id),
            ProjectionExpression='id, message, keywords'
        )
        if not response.get('Items'):
            raise RuntimeError(f"No criteria found for checklist_id {checklist_id}")
        criteria = [{'id': item['id'], 'message': item['message'], 'keywords': item.get('keywords', [])} for item in response.get('Items')]
        return criteria
    except Exception as e:
        logger.error(f"Failed to retrieve criteria: {e}")
        raise RuntimeError("Failed to retrieve criteria")


def retrieve_candidate_github_data(github_client: GithubClient) -> list:
    """
    Retrieves the candidate's GitHub repository data.

    :param github_client: The GitHub client.
    :return: The candidate's GitHub repository data.
    """
    n_repositories = 8
    pinned_repositories = github_client.get_n_repositories_name(n=n_repositories)
    logger.info("Retrieving repositories data...")
    try:
        repositories_data = []
        for repository_name in pinned_repositories:

            programming_languages: dict = github_client.get_programming_languages_used(repository_name)
            repo_tree: list = github_client.get_repository_tree(repository_name)
            num_of_files = len([branch['path'] for branch in repo_tree if branch["type"] == "blob"])
            num_of_dirs = len([branch['path'] for branch in repo_tree if branch["type"] == "tree"])

            n = 5
            depth_n_files = [branch['path'] for branch in repo_tree if branch["path"].count("/") < n and branch["type"] == "blob"]
            while len(depth_n_files) > 400:
                n -= 1
                depth_n_files = [file for file in depth_n_files if file.count("/") < n]

            repo_structure: str = GithubClient.get_organized_folder_structure(depth_n_files)
            package_files: list = GithubClient.get_package_file_paths_to_read(depth_n_files, programming_languages)

            general_info = github_client.get_general_repository_information(repository_name)
            general_info['languages'] = programming_languages
            general_info['num_dirs'] = num_of_dirs
            general_info['num_files'] = num_of_files
            repo_data = {
                'name': repository_name,
                'general_info': general_info,
                'structure': repo_structure,
                'files': []
            }

            for file_path in package_files:
                file_content = github_client.read_file(repository_name, file_path)
                compressed_content = compress_file_content(file_path, file_content)
                repo_data['files'].append({
                    'path': file_path,
                    'content': compressed_content
                })
            repositories_data.append(repo_data)

        return repositories_data
    except Exception as e:
        logger.error(f"Error retrieving repositories data: {e}")
        raise RuntimeError("Error retrieving repositories data")


def get_system_and_user_message(repositories_data: list, criteria: dict) -> tuple:
    """
    Generates the system and user messages for the candidate evaluation.

    :param repositories_data: The candidate's GitHub repository data.
    :param criteria: The criteria for the candidate evaluation.
    :return: The system and user messages for the candidate evaluation.
    """
    system_message = """
        A company is seeking skilled software engineers for its projects. The assessment will be based on the candidate's GitHub repositories contents.
        The criteria include specific skills and technologies relevant to the company's needs. 
        The evaluation will be on a scale of 0 to 10, with 0 indicating a lack of skill and 10 representing perfect proficiency.

        Consider the following factors:
        1. **Accuracy and Consistency:**
        - Assess the candidate's skillset based on the repositories provided.
        - Experience with a technology in a larger repository is more valuable than using it in smaller repositories multiple times.
        - IMPORTANT!!! If the candidate has used the technology at least once in a large repository, the score must be higher than 7.
        - Evaluation is based on how the candidate used the technology in the repository, not on the size of the repository and other factors like github statistics.
        - Even if the size of the repository is large, if the candidate has not used the technology at all including the related technology, the score must be 0.
        - Do not give high scores when you cannot find any evidence of the technology.
        - Always evaluate all criteria, even if the candidate has no repositories that demonstrate a skill.
        - To evaluate a candidate accurately and consistently, always follow the guildelines below.
        "score_guidelines": {
            "0": "No use of the technology or related technologies.",
            "1": "No direct use of the technology; related technology used in small repositories.",
            "2": "No direct use of the technology; related technology used in medium-sized repositories.",
            "3": "No direct use of the technology; related technology used in large repositories.",
            "4": "No direct use of the technology; but related technology used multiple times or once in a very large repository.",
            "5": "Technology used once in a small-sized repository, or related technology used in large repositories.",
            "6": "Technology used once in a medium-sized repository, or twice in small-sized repositories.",
            "7": "Technology used once in a large repository, or twice in medium or small repositories.",
            "8": "Technology used once in a very large repository, or twice in medium or large repositories",
            "9": "Technology used more than twice across large or medium repositories.",
            "10": "Technology used more than twice across a mix of large and very large repositories."
        }

        - As mentioned above, the size of the project is a very important factor to get higher scores, so you need to consider the size of the project when scoring.
        - To examine the size of the project, consider all the criteria blow, and determine the size of the repository in general:
        "repository_size_guidelines": {
            "number_of_languages": "1-2 languages indicate a smaller project; 3-5 a medium-sized; 6+ a large project; 10+ a very large project.",
            "combined_size_of_languages": "Fewer than 100,000 bytes indicate a small project; 100,000-500,000 a medium-sized; 500,000+ a large project; 1,000,000+ a very large project. // this is for all languages combined",
            "number_of_commits": "Fewer than 100 commits indicate a small project; 100-500 a medium-sized; 500+ a large project; 1000+ a very large project.",
            "repository_age": "Less than 1 year old is considered new; 1-3 years old a medium-aged; 3+ years old a well-established project; 5+ years old a very well-established project.",
            "number_of_files_and_directories": "Fewer than 200 items indicate a small project; 200-500 a medium-sized; 500+ a large project; 1000+ a very large project.",
            "contributors": "1-2 contributors indicate a smaller project; 3-10 a medium-sized; 10+ a large project; 20+ a very large project.",
            "issues_and_pull_requests": "Fewer than 300 indicate a small project; 300-1000 a medium-sized; 1000 a large project; 2000+ a very large project.",
        }
        - Note: The value of the score is absolute and does not change depending on the score of other criteria. Score each criterion as a separate one with an absolute rating.

        2. **Detailed Reasoning:**
        - Precision and detail in reasoning are vital, state clearly why you gave the score.
        - If you cannot find any evidence of the technology, say so.
        - !Important: Never ever mention the name of any files and information like the number of commits, number of files, etc. in the reason.
        - Never mention other criteria or technologies that are not related to the criterion.
        - This reasoning is based on how the candidate used the technology in the criterion and other factors like github statistics.
        - For higher scores,always mention the repository name, criterion technology, the reason why you gave the score. Only if you want to emphasize why the score is, mention the size of the repository as well.
        - If you found the related technology, mention which technology you found.
        Examples: 
            - "No evidence of the use of NextJS and other frontend frameworks in the account."
            - "The repository 'my-repository' contains evidence of Docker usage, containerizing an application for deploying. However, the experience is not extensive enough to give a higher score."
            - "The candidate has extensive evidence of using Python across multiple repositories like 'python-repo', for backend service and machine learning. This candidate has a lot of experience with Python."

        3. **Total Score Calculation:**
        - THIS IS VERY IMPORTANT!!!: The total score MUST be the AVERAGE VALUE of scores for each criterion.
        - YOU MUST CALCULATE the AVERAGE VALUE after scoring all criteria. Add each score and divide by the number of criteria. The avarage score can contain one decimal point.
        - For example, if there are 3 criteria and the scores are 5, 8, and 9, the total score will be (5 + 8 + 9) / 3 = 7.3
        Your response will look like this in JSON format:
        {
            "assessments": [
                {
                    "criterion_id": string, // criterion's id
                    "criterion_message": string, // criterion's message
                    "score": number, // score from 0 to 10 (int)
                    "reason": string // reason for the score (2-3 sentences)
                },
                {
                }, ... // other criteria
            ],
            "total_score": number, // avarage value of scores for each criterion (one decimal point). you are not allowed to give a value other than the average, always calculate this value after all the scoring is done.
            "summary": string // general comment about the candidate's skillset (3-4 sentences, highlight strengths and weaknesses. use the information from the criteria and the total score.)
        }
    """

    user_message = "First of all, here are criteria that the company needs candidates to have. You need to assess candidates on each criteria: "
    for i in range(len(criteria)):
        criterion = criteria[i]
        user_message += "\n" + "criterion" + str(i + 1) + ". id: " + criterion['id'] + criterion["message"]
    user_message += "\n\n"

    user_message += """
        Next, here are the data from the candidate's GitHub Account. 
        Note: The contents of the file have been modified to reduce the number of TOKEN and may not be written in correct syntax. 
        In that case, you must guess the contents of the original file yourself and do the evaluation accordingly. 
        The fact that the content is syntactically incorrect has no effect on the evaluation at all.
        Do not miss any information in the data below when evaluating the candidate especially keywords and technologies in criteria above.\n:
    """
    for repository_data in repositories_data:
        general = repository_data['general_info']
        user_message += "Repository: " + repository_data['name'] + "\n"

        user_message += "This repository uses the following programming languages: "
        for name, bytes in general['languages'].items():
            user_message += name + "(" + str(bytes) + " bytes), "
        user_message += "\n"

        user_message += f"""
            number of commits: {general['num_commits']}
            created_at: {general['created_at']}
            last updated_at: {general['last_updated_at']}
            number of files: {general['num_files']}
            number of directories: {general['num_dirs']}
            number of contributors: {general['contributors']}
            number of issues and pull requests: {general['issues_and_pull_requests']}
        """

        user_message += "This repository has the following file structure: \n"
        user_message += repository_data['structure'] + "\n"

        if len(user_message) > 50000:
            logger.info("User message is too long, truncating...")
            break

        for file_data in repository_data['files']:
            user_message += "file paths: " + file_data['path'] + "\n"
            user_message += file_data['content'] + "\n\n"

        user_message += "Repository " + repository_data['name'] + " ends here.\n\n"

        if len(user_message) > 50000:
            logger.info("User message is too long, truncating...")
            user_message = user_message[:50000] + "...\n Repository " + repository_data['name'] + " ends here.\n\n"
            break

    return system_message, user_message


def evaluate_candidate_with_gpt(system_message: str, user_message: str) -> dict:
    """
    Evaluates a candidate's GitHub repository contents against specified criteria using ChatGPT.

    :param system_message: The system message to be sent to ChatGPT.
    :param user_message: The user message to be sent to ChatGPT.
    :return: A dictionary with the candidate's evaluation result in JSON format.
    """
    logger.info("Getting the candidate evaluation from GPT...")
    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.01,
            seed=42,
        )
        token_estimation = (len(system_message) + len(user_message)) / 4
        logger.info(f"Input token estimation: {token_estimation}")
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        logger.error(f"Failed to generate criteria from gpt: {e}")
        raise RuntimeError("Failed to generate criteria from gpt")


def save_candidate_result(candidate_result_id: str, candidate_result: dict):
    """
    Saves candidate evaluation result to database.

    :param checklist_id: The ID of the checklist.
    :param candidate_id: The ID of the candidate.
    :param candidate_result: The candidate's evaluation result.
    :return: The ID of the candidate result.
    """
    logger.info("Saving the candidate result...")
    try:
        total_score = candidate_result['total_score']
        summary = candidate_result['summary'].replace("'", "''")
        sql = """
            UPDATE candidate_result SET total_score = %s, summary = %s WHERE id = %s;
        """
        db_cursor.execute(sql, (total_score, summary, candidate_result_id))
    except Exception as e:
        logger.error(f"Failed to save candidate result: {e}")
        raise RuntimeError("Failed to save candidate result")


def save_candidate_assessments(candidate_result_id: str, assessments: dict):
    """
    Saves candidate evaluation result to database.

    :param candidate_result_id: The ID of the candidate result.
    :param assessments: The candidate's assessments.
    """
    logger.info("Saving the candidate assessments...")
    try:
        sql = "INSERT INTO assessment_criteria (id, candidate_result_id, criterion_id, score, reason) VALUES"
        for assessment in assessments:
            id = str(uuid.uuid4())
            criterion_id = assessment['criterion_id']
            score = assessment['score']
            reason = assessment['reason'].replace("'", "''")
            sql += f" ('{id}', '{candidate_result_id}', '{criterion_id}', {score}, '{reason}'),"

        sql = sql[:-1] + ";"
        db_cursor.execute(sql)
    except Exception as e:
        logger.error(f"Failed to save candidate assessments: {e}")
        raise RuntimeError("Failed to save candidate assessments")


def update_candidate_result_status(candidate_result_id: str, status='failed'):
    """
    Updates the status of the candidate result.

    :param candidate_result_id: The ID of the candidate result.
    :param status: The status of the candidate result.
    """
    logger.info("Updating the candidate result status...")
    sql = f"SELECT status FROM candidate_result WHERE id = '{candidate_result_id}';"
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        if result and result[0]:
            current_status = result[0]
        else:
            current_status = None
    except Exception as e:
        logger.error(f"Failed to get candidate result status: {e}")
        raise RuntimeError("Failed to get candidate result status")

    if current_status is None or current_status != 'scheduled':
        logger.info(f"Evaluation status is not scheduled, nothing to update. status: {current_status}")
        return

    try:
        sql = f"UPDATE candidate_result SET status = '{status}' WHERE id = '{candidate_result_id}';"
        db_cursor.execute(sql)
        db_conn.commit()
    except Exception as e:
        logger.error(f"Failed to update candidate result status: {e}")
        raise RuntimeError("Failed to update candidate result status")


def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    logger.info(event)
    try:
        messages = event['Records']
        body = json.loads(messages[0]['body'])
        logger.info(f"Received evaluate candidate request: {body}")

        evaluation_status = 'failed'
        candidate_result_id = body['candidate_result_id']

        connect_to_db()

        checklist_id = body.get('checklist_id')
        github_username = body.get('candidate_github_username')
        github_access_token = get_github_access_token_from_checklist_id(checklist_id)
        github_client = GithubClient(github_username, github_access_token)

        criteria = get_criteria_from_dynamodb(checklist_id)
        repositories_data = retrieve_candidate_github_data(github_client)
        logger.info(f'Repositories data retrieved successfully for the user: {repositories_data}')

        system_message, user_message = get_system_and_user_message(repositories_data, criteria)
        candidate_result = evaluate_candidate_with_gpt(system_message, user_message,)
        logger.info(f"Generated candidate evaluation successfully: {candidate_result}")

        logger.info("Saving the candidate evaluation to db...")
        save_candidate_result(candidate_result_id, candidate_result)
        save_candidate_assessments(candidate_result_id, candidate_result['assessments'])

        evaluation_status = 'succeeded'
        logger.info("Saved candidate evaluation to database successfully")
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
    finally:
        try:
            update_candidate_result_status(candidate_result_id, evaluation_status)
            if db_conn:
                db_conn.close()
        except Exception as e:
            logger.error(f'Failed to update candidate result status: {e}')
