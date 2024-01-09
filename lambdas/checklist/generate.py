import json
import datetime
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
dynamodb_client = boto3.client('dynamodb')

# Postgres
db_conn = None
db_cursor = None

# OpenAI
chat_client = OpenAI()

# SQS
sqs = boto3.client('sqs')


def connect_to_db():
    """
    Reconnects to the database.
    """
    logger.info("Connecting to the db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_github_access_token_from_position_id(position_id: str):
    """
    Gets the github access token from the position id.

    :param position_id: Unique identifier for the position.
    :return: The github access token.
    """
    logger.info("Getting the github access token from position id...")
    sql = """
            SELECT Company.github_access_token FROM Company
            INNER JOIN Position ON Company.id = Position.company_id
            WHERE Position.id = '%s';
        """
    try:
        db_cursor.execute(sql % (position_id))
        result = db_cursor.fetchone()
        if result and result[0]:
            return decrypt_github_access_token(result[0])
        else:
            return None
    except Exception as e:
        logger.error(f"Error getting github access token from postgres: {e}")
        raise RuntimeError(f"Error getting github access token from postgres: {e}")


def retrieve_repositories_data(github_client: GithubClient, repository_names: list) -> list:
    """
    Retrieves the repositories' data from GitHub.

    :param github_client: An instance of the GitHub client.
    :param repository_names: A list of repository full names.
    :return: A list of dictionaries containing the repositories' data.
    """

    logger.info("Retrieving repositories data...")
    try:
        repositories_data = []
        for repository_name in repository_names:

            programming_languages: dict = github_client.get_programming_languages_used(repository_name)
            repo_tree: list = github_client.get_repository_tree(repository_name)

            n = 5
            depth_n_files = [branch['path'] for branch in repo_tree if branch["path"].count("/") < n and branch["type"] == "blob"]
            while len(depth_n_files) > 400:
                n -= 1
                depth_n_files = [file for file in depth_n_files if file.count("/") < n]

            repo_structure: str = GithubClient.get_organized_folder_structure(depth_n_files)
            package_files: list = GithubClient.get_package_file_paths_to_read(depth_n_files, programming_languages)

            repo_data = {'name': repository_name, 'languages': programming_languages, 'structure': repo_structure, 'files': []}
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
        raise RuntimeError(f"Error retrieving repositories data: {e}")


def get_system_and_user_message(repositories_data: list):
    """
    Generates a system message and a user message to be used as prompt for OpenAI's ChatGPT.

    :param repositories_data: A list of dictionaries containing the repositories' data.
    :return: A system message and a user message.
    """
    logger.info("Generating the system and user message...")
    system_message = """
        You are tasked with analyzing our company's repository files to identify specific skills and technologies necessary for candidates applying to our company.
        The goal is to create a set of criteria that accurately reflect the core technologies and key aspects of software development pertinent to our projects.
        Your response must be in JSON format, with each essential skill or technology represented as an independent criterion. Please adhere to the following detailed instructions:

        1. **Format Specification**: Structure the response in JSON format. Each entry should consist of a 'keywords' array and a 'message' string within a criterion object.

        2. **Individual Major Technologies**: Each major technology must be treated as a distinct and separate criterion.
            Type of major technologies include programming languages, frameworks, and infrastructure elements.
            Type of minor technologies include libraries, tools, and packages.
            Avoid grouping these major technologies under any circumstance to ensure precise evaluation of candidate abilities in each distinct area.
            You can group major technologies with minor technologies, but not with other major technologies.
            You cannot create a criteria with only minor technologies.

        3. **Grouping of Related Tools**: Combine technologies or tools that are closely related and often used together into a single criterion.
            For example, 'Git' and 'GitHub' can be grouped together for version control, and 'React' with 'Next.js' for front-end development.
            This grouping should be judicious, maintaining relevance and coherence. For example, 'Git' and 'React' should not be grouped together.
            You can also include a technology that is not found in our repositories but is relevant to the criterion. However, in that case, you cannot add that keyword in the message.

        4. **Descriptive Messages**: Each criterion should include a brief message, preferably within 6-8 words, describing the role and importance of the technology or skill in our projects.
            Never use too long message like 15 words, it's too long. For example, 'JavaScript and React for client-side development' or 'AWS services including EC2, ECS, and RDS for cloud services'.
            Users cannot see keywords, so the message must be descriptive enough to convey the criterion's purpose and relevance. Include major technologies in the keywords in the message.
            If the message needs to be long to convey the criterion's purpose, then it is likely that the criterion is too broad and should be split into multiple criteria.

        5. **Number of Criteria**: Target around 8-10 criteria, but this can vary (6 to 12) depending on the repository's contents, ensuring comprehensive coverage without overcomplication.
            It's much better to have more criteria than making them too broad and general using too many keywords in a single criterion.

        6. **Guidance from Repository Data**: Utilize the provided details on programming languages and technologies in our repositories to guide the inclusion and emphasis of relevant languages and technologies in your criteria.

        Your response must be in the following JSON format like this (example):
        {
            "criteria": [
                {
                    "keywords": ["Python", "API"],
                    "message": "Python for back-end development and API creation"
                },
                {
                    "keywords": ["React", "Next.js"],
                    "message": "React and Next.js for front-end development"
                },
                {
                    "keywords": ["Docker"],
                    "message": "Docker for containerization"
                },
                // more criteria
            ]
        }

        Ensure that the response strictly adheres to these guidelines to formulate a clear, relevant, and effective set of criteria for evaluating potential candidates.
        Below is the data on programming languages used in our repositories, which should guide the inclusion of relevant languages in your criteria.
    """

    user_message = "Here are the company's repositories and the file contents:\n"
    for repository_data in repositories_data:
        user_message += "Repository: " + repository_data['name'] + "\n"

        user_message += "This repository uses the following programming languages: "
        for name, bytes in repository_data['languages'].items():
            user_message += name + "(" + str(bytes) + " bytes), "
        user_message += "\n"

        user_message += "This repository has the following file structure: \n"
        user_message += repository_data['structure'] + "\n"

        if len(user_message) > 50000:
            break

        for file_data in repository_data['files']:
            user_message += "file paths: " + file_data['path'] + "\n"
            user_message += file_data['content'] + "\n\n"

        user_message += "Repository " + repository_data['name'] + " ends here.\n\n"

        if len(user_message) > 50000:
            user_message = user_message[:50000] + "...\n Repository " + repository_data['name'] + " ends here.\n\n"
            break

    return system_message, user_message


def get_criteria_from_gpt(system_message: str, user_message: str) -> list:
    """
    Generates a list of criteria keywords using OpenAI's ChatGPT based on given prompt and programming languages.

    :param system_message: A system message to be used as prompt for OpenAI's ChatGPT.
    :param user_message: A user message to be used as prompt for OpenAI's ChatGPT.
    :return: A list of criteria keywords.
    """
    logger.info("Getting the criteria from GPT...")
    try:
        token_estimation = (len(system_message) + len(user_message)) / 4
        logger.info(f"Estimated prompt token: {token_estimation}")

        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
        )
        content = json.loads(completion.choices[0].message.content)
        logger.info(f"Criteria generated: {content['criteria']}")
        return content['criteria']
    except Exception as e:
        logger.error(f"Error generating criteria with OpenAI API: {e}")
        raise RuntimeError("Error generating criteria with OpenAI API")


def save_checklist_to_db(position_id: str) -> str:
    """
    Saves the generated checklist to the database.

    :param position_id: Unique identifier for the position.
    :return: Unique identifier for the checklist.
    """
    logger.info("Saving the checklist to db...")
    checklist_id = str(uuid.uuid4())
    sql = f"INSERT INTO checklist (id, position_id) VALUES ('{checklist_id}', '{position_id}');"
    try:
        db_cursor.execute(sql)
        return checklist_id
    except Exception as e:
        logger.error(f"Error saving checklist to postgres: {e}")
        raise RuntimeError("Error saving checklist to postgres")


def save_criteria_to_dynamodb(criteria: list, checklist_id: str):
    """
    Saves the generated criteria to the database.

    :param criteria: A list of criteria keywords.
    :param checklist_id: Unique identifier for the checklist.
    """
    logger.info("Saving criteria to db...")
    transact_items = []
    for criterion in criteria:
        criteria_info = {
            'id': {'S': str(uuid.uuid4())},
            'checklist_id': {'S': checklist_id},
            'keywords': {'L': [{'S': keyword} for keyword in criterion['keywords']]},
            'message': {'S': criterion['message']},
            'created_at': {'S': datetime.datetime.now().isoformat()}
        }
        transact_items.append({
            'Put': {
                'TableName': Config.DYNAMO_CRITERIA_TABLE_NAME,
                'Item': criteria_info
            }
        })

    try:
        response = dynamodb_client.transact_write_items(
            TransactItems=transact_items
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            logger.error(f"Error saving criteria to DynamoDB status code is not 200: {response}")
            raise RuntimeError("Error saving criteria to DynamoDB")
    except Exception as e:
        logger.error(f"Error saving criteria to DynamoDB: {e}")
        raise RuntimeError("Error saving criteria to DynamoDB")


def save_repository_names_to_db(checklist_id: str, repository_names: list):
    """
    Saves the repository names to the database.

    :param checklist_id: Unique identifier for the checklist.
    :param repository_names: A list of repository full names.
    """
    logger.info("Saving repository names to db...")
    if len(repository_names) == 0:
        return
    sql = "INSERT INTO checklist_repository (id, checklist_id, repository_name) VALUES"
    for repository_name in repository_names:
        sql += f" ('{str(uuid.uuid4())}', '{checklist_id}', '{repository_name}'),"
    sql = sql[:-1] + ";"
    try:
        db_cursor.execute(sql)
    except Exception as e:
        logger.error(f"Error saving repository names to postgres: {e}")
        raise RuntimeError("Error saving repository names to postgres")


def update_generation_status(position_id: str, checklist_status='failed'):
    """
    Updates the generation status of the position.

    :param position_id: Unique identifier for the position.
    :param checklist_status: The status of the checklist.
    """
    logger.info("Updating the generation status...")
    sql = f"SELECT checklist_generation_status FROM position WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        if result and result[0]:
            current_status = result[0]
        else:
            current_status = None
    except Exception as e:
        logger.error(f"Error getting generation status from postgres: {e}")
        raise RuntimeError("Error getting generation status from postgres")

    if current_status is None or current_status != 'scheduled':
        logger.info(f"Generation status is not scheduled, nothing to update. status: {current_status}")
        return

    sql = f"UPDATE position SET checklist_generation_status = '{checklist_status}' WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        db_conn.commit()
    except Exception as e:
        logger.error(f"Error updating generation status in postgres: {e}")
        raise RuntimeError("Error updating generation status in postgres")


def get_position_type(position_id: str) -> str:
    """
    Gets the position type from the position id.

    :param position_id: Unique identifier for the position.
    :return: The position type.
    """
    logger.info("Getting the position type from position id...")
    sql = f"SELECT type FROM position WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        if result and result[0]:
            return result[0]
        else:
            return None
    except Exception as e:
        logger.error(f"Error getting position type from postgres: {e}")
        raise RuntimeError(f"Error getting position type from postgres: {e}")


def get_default_criteria(position_id: str) -> list:
    """
    Gets the default criteria for the position.

    :param position_id: Unique identifier for the position.
    :return: A list of criteria keywords.
    """
    logger.info("Getting the default criteria...")
    try:
        position_type = get_position_type(position_id)
        if position_type != 'frontend' and position_type != 'backend' and position_type != 'devops':
            position_type = 'fullstack'
        return Config.DEFAULT_CRITERIA[position_type]
    except Exception as e:
        logger.error(f"Error getting default criteria: {e}")
        raise RuntimeError(f"Error getting default criteria: {e}")


def handler(event, context):
    """
    Lambda handler.

    :param event: The event data.
    :param context: The context data.
    """
    logger.info(event)
    try:
        logger.info('Received generate criteria request')
        connect_to_db()
        checklist_status = 'failed'

        messages = event['Records']
        body = json.loads(messages[0]['body'])
        position_id = body.get('position_id')
        repository_names = body.get('repository_names')

        if len(repository_names) == 0:
            criteria = get_default_criteria(position_id)
            logger.info('Successfully retrieved default criteria')

        else:
            github_username = body.get('github_username')
            github_access_token = get_github_access_token_from_position_id(position_id)

            github_client = GithubClient(github_username, github_access_token)
            repositories_data = retrieve_repositories_data(github_client, repository_names)
            logger.info(f'Repositories data retrieved successfully for position: {repositories_data}')

            system_message, user_message = get_system_and_user_message(repositories_data)
            criteria = get_criteria_from_gpt(system_message, user_message,)
            logger.info(f'Checklist and Criteria generated successfully for position: {position_id}')

        checklist_id = save_checklist_to_db(position_id)
        save_criteria_to_dynamodb(criteria, checklist_id)
        save_repository_names_to_db(checklist_id, repository_names)

        checklist_status = 'succeeded'
        logger.info('Criteria saved successfully')

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Criteria generation failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Criteria generation failed (status {str(status_code)}): {e}')
    finally:
        update_generation_status(position_id, checklist_status)
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
