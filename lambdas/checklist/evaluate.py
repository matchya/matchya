import json
import uuid
import logging

import boto3
import psycopg2

from openai import OpenAI

from config import Config
from client.github import GithubClient

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


def save_candidate_info_to_db(body):
    """
    Saves candidate information to database.

    :param body: The request body containing candidate information.
    """
    logger.info("Saving candidate info to db...")
    try:
        id = str(uuid.uuid4())
        first_name = body.get('candidate_first_name', '')
        last_name = body.get('candidate_last_name', '')
        github_username = body.get('candidate_github_username', '')
        email = body.get('candidate_email', '')
        sql = """
            INSERT INTO candidate (id, first_name, last_name, github_username, email) VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (email) DO UPDATE SET (first_name, last_name, github_username) = (%s, %s, %s) RETURNING id;
        """
        db_cursor.execute(sql, (id, first_name, last_name, github_username, email, first_name, last_name, github_username))
        result = db_cursor.fetchone()
        if not result:
            logger.info(f"New candidate is saved to db successfully id: {id}")
            return id
        logger.info(f"Candidate already exists in db, updated the information. candidate id is still: {result[0]}")
        return result[0]
    except Exception as e:
        raise RuntimeError(f"Failed to save candidate info: {e}")


def get_criteria_from_dynamodb(checklist_id):
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
        raise RuntimeError(f"Failed to retrieve criteria: {e}")


def evaluate_candidate(github_client: GithubClient, repository_names, criteria):
    """
    Generates criteria from GitHub repositories.

    :param github_client: A GitHub client object.
    :param repository_names: A list of repository names.
    :param criteria: A list of criteria with id, keywords and message
    :return: A list of criteria.
    """
    logger.info("Evaluating the candidate...")
    try:
        contents_and_languages = github_client.get_repos_file_contents_and_languages(repository_names)
    except Exception as e:
        raise RuntimeError(f"Error Reading files: {e}")

    return get_candidate_evaluation_from_gpt(criteria, contents_and_languages['file_content'], contents_and_languages['languages'])


def get_candidate_evaluation_from_gpt(criteria, file_content, languages):
    """
    Evaluates a candidate's GitHub repository contents against specified criteria using ChatGPT.

    :param criteria_full_messages: A list of criteria id, keywords, and messages.
    :param repos_content: Content from the candidate's GitHub repositories.
    :param languages: A dictionary of programming languages and their byte sizes.
    :return: A JSON object representing the candidate's evaluation scores and reasons, based on the criteria.
    """
    logger.info("Getting the candidate evaluation from GPT...")
    system_message = "A company is looking for promising employees as software engineers. Candidates need to have a skillset to work on the company's project in terms of programming languages and other technologies. These are criteria that the company needs candidates to have. You need to assess candidates on each criteria with keywords and a message : "

    for i in range(len(criteria)):
        criterion = criteria[i]
        system_message += "\n" + "criterion" + str(i + 1) + ". id: " + criterion['id'] + criterion["message"] + " (keywords: " + ", ".join(criterion["keywords"]) + ")"

    system_message += """
        A company is seeking skilled software engineers for its projects. The assessment will be based on the candidate's GitHub repositories contents. 
        The criteria include specific skills and technologies relevant to the company's needs. 
        The evaluation will be on a scale of 0 to 10, with 0 indicating a lack of skill and 10 representing perfect proficiency.

        Consider the following factors:
        1. **Accuracy and Consistency:**
        - Assess the candidate's skillset based on files like "README.md," "package.json," and "requirements.txt."
        - Larger repositories may indicate experience with larger projects, making certain technologies more significant.
        - Repeated use of a technology across repositories suggests familiarity and expertise.
        - Always evaluate all criteria, even if the candidate has no repositories that demonstrate a skill.
        - To evaluate a candidate accurately and consistently, follow the guildelines below.
        score_guidelines = {
            0: "Candidate lacks essential skills outlined in the criteria. For example, if Frontend development requires TypeScript and React, a score of 0 implies a complete absence of these skills.",
            1: "Candidate exhibits minimal skills related to the specified message and keywords, or shows basic skills in similar areas. If the criterion is proficiency in Python for backend development, a score of 1 might be assigned if the candidate demonstrates basic experience with similar backend technologies.",
            2: "Candidate displays limited proficiency related to the specified message and keywords or exhibits minimal skills in similar areas. A score of 2 suggests a partial alignment with the criterion, but the essential skill is not fully present.",
            3: "Candidate demonstrates below-average proficiency in the specified skillset. There is limited evidence of relevant experience in the repositories, indicating a basic understanding but falling short of moderate proficiency.",
            4: "Candidate shows moderate proficiency. Evidence in repositories indicates a clear understanding and application of the specified skillset.",
            5: "Candidate demonstrates moderate proficiency. Evidence in repositories indicates a clear understanding and application of the specified skillset.",
            6: "Candidate exhibits above-average proficiency in the specified skillset. There is clear evidence of relevant experience in the repositories, demonstrating a stronger understanding and application of the specified skillset but falling short of significant proficiency.",
            7: "Candidate demonstrates significant proficiency in the specified skillset. There is clear evidence of relevant experience in the repositories, demonstrating a strong understanding and application of the specified skillset.",
            8: "Candidate shows significant proficiency. Clear evidence in repositories, for instance in Frontend development with React, multiple repositories showcase well-implemented React components.",
            9: "Candidate exhibits exceptional proficiency. Evidence in repositories indicates advanced skills and significant experience, such as proficiency in multiple programming languages and frameworks.",
            10: "Candidate possesses extensive experience using the specified skillset, likely in large or multiple projects. Proficiency is evident, and the candidate is highly skilled and knowledgeable in the relevant technologies. If the criterion involves expertise in a specific framework like Django for backend development, a score of 10 may be given if the candidate has successfully implemented and maintained complex Django projects at scale."
        }
        - Note: The value of the score is absolute and does not change depending on the score of other criteria. Score each criterion as a separate one with an absolute rating.

        2. **Message Importance:**
        - Emphasize that the evaluation is primarily based on the message, not just keywords.
        - A candidate doesn't need every keyword; proficiency in the mentioned technology is crucial.
        - Provide scores and reasoning that align clearly with the message content.

        3. **Detailed Reasoning:**
        - Precision and detail in reasoning are vital.
        - For lower scores, explain why, highlighting factors like project size or similar skills.
        - Higher scores (7, 8, or above) require clear identification of repositories showcasing skills and their quality.
        - Always explain which repositories demonstrate the candidate's skillset and why they are significant if the candidate has the skill. However, NEVER EVER mention the name files because we want to hide what file you read.

        4. **Total Score Calculation:**
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

    languages_info = "\nHere is the list of programming languages this candidate used. If you can use this as helpful information, use it:"
    for name, bytes in languages.items():
        languages_info += name + "(" + str(bytes) + " bytes), "

    user_message = """
        Here are the files from the candidate's GitHub Account. 
        Note: The contents of the file have been modified to reduce the number of TOKEN and may not be written in correct syntax. 
        In that case, you must guess the contents of the original file yourself and do the evaluation accordingly. 
        The fact that the content is syntactically incorrect has no effect on the evaluation at all:\n"""
    user_message += file_content + languages_info

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
        token_estimation = (len(system_message) + len(file_content)) / 5
        logger.info(f"Input token estimation: {token_estimation}")
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        raise RuntimeError(f"Failed to generate criteria from gpt: {e}")


def save_candidate_evaluation_to_db(checklist_id, candidate_id, candidate_result):
    """
    Saves candidate evaluation result to database.

    :param checklist_id: The ID of the checklist.
    :param candidate_id: The ID of the candidate.
    :param candidate_result: The candidate's evaluation result.
    """
    logger.info("Saving the candidate evaluation to db...")
    candidate_result_id = save_candidate_result(checklist_id, candidate_id, candidate_result)
    save_candidate_assessments(candidate_result_id, candidate_result['assessments'])


def save_candidate_result(checklist_id, candidate_id, candidate_result):
    """
    Saves candidate evaluation result to database.

    :param checklist_id: The ID of the checklist.
    :param candidate_id: The ID of the candidate.
    :param candidate_result: The candidate's evaluation result.
    """
    logger.info("Saving the candidate result...")
    try:
        id = str(uuid.uuid4())
        total_score = candidate_result['total_score']
        summary = candidate_result['summary'].replace("'", "''")
        sql = "INSERT INTO candidate_result (id, checklist_id, candidate_id, total_score, summary) VALUES (%s, %s, %s, %s, %s)"
        db_cursor.execute(sql, (id, checklist_id, candidate_id, total_score, summary))
        return id
    except Exception as e:
        raise RuntimeError(f"Failed to save candidate result: {e}")


def save_candidate_assessments(candidate_result_id, assessments):
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
        raise RuntimeError(f"Failed to save candidate assessments: {e}")


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

        connect_to_db()

        candidate_id = save_candidate_info_to_db(body)
        logger.info(f"Saved candidate info to database successfully: {candidate_id}")

        checklist_id = body.get('checklist_id')
        github_username = body.get('candidate_github_username')
        github_client = GithubClient(github_username)

        criteria = get_criteria_from_dynamodb(checklist_id)
        pinned_repositories = github_client.get_pinned_repositories_name()
        candidate_result = evaluate_candidate(github_client, pinned_repositories, criteria)
        logger.info(f"Generated candidate evaluation successfully: {candidate_result}")

        save_candidate_evaluation_to_db(checklist_id, candidate_id, candidate_result)
        db_conn.commit()
        logger.info("Saved candidate evaluation to database successfully")
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
    finally:
        if db_conn:
            db_conn.close()
