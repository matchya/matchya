import json
import datetime
import uuid
import logging

import boto3
import psycopg2
from openai import OpenAI

from config import Config
from client.github import GithubClient

from utils.response import generate_success_response, generate_error_response
from utils.request import parse_request_body, validate_request_body

# Logger
logger = logging.getLogger('generate criteria')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

# DynamoDB
dynamodb_client = boto3.client('dynamodb')

# Postgres
db_conn = None
db_cursor = None

# OpenAI
chat_client = OpenAI()


def connect_to_db():
    """
    Reconnects to the database.
    """
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_github_username_from_position_id(position_id):
    """
    Retrieves the GitHub username of the company from the database.
    
    :param position_id: Unique identifier for the position.
    :return: The GitHub username of the company.
    """
    sql = """
            SELECT Company.github_username FROM Company
            INNER JOIN Position ON Company.id = Position.company_id
            WHERE Position.id = '%s';
        """
    try:
        db_cursor.execute(sql % (position_id))
        return db_cursor.fetchone()[0]
    except Exception as e:
        raise RuntimeError(f"Error getting github_username from postgres: {e}")

def generate_criteria_by_repositories(github_client: GithubClient, repository_names):
    """
    Generates criteria from GitHub repositories.
    
    :param github_client: A GitHub client object.
    :param repository_names: A list of repository names.
    :return: A list of criteria generated by OpenAI's GPT.
    """
    try:
        contents_and_languages = github_client.get_repos_file_contents_and_languages(repository_names)
    except Exception as e:
        raise RuntimeError(f"Error Reading files: {e}")

    return get_criteria_from_gpt(contents_and_languages['file_content'], contents_and_languages['languages'])


def get_criteria_from_gpt(file_content, languages):
    """
    Generates a list of criteria keywords using OpenAI's ChatGPT based on given prompt and programming languages.

    :param file_content: A string containing the contents of all files in the repositories.
    :param languages: A dictionary containing the programming languages and their byte size.
    :return: A list of criteria with keywords and message.
    """
    system_message = """
        You are tasked with analyzing our company's repository files to identify specific skills and technologies necessary for candidates applying to our company. 
        The goal is to create a set of criteria that accurately reflect the core technologies and key aspects of software development pertinent to our projects. 
        Your response must be in JSON format, with each essential skill or technology represented as an independent criterion. Please adhere to the following detailed instructions:

        1. **Format Specification**: Structure the response in JSON format. Each entry should consist of a 'keywords' array and a 'message' string within a criterion object.

        2. **Individual Major Technologies**: Each major technology must be treated as a distinct and separate criterion. 
            This is imperative for technologies like Docker, AWS, Terraform, Kubernetes, Python, and JavaScript, among others. 
            It is essential to understand that each of these technologies is a critical and standalone skill. 
            For example, 'Docker' should form its own criterion focusing exclusively on containerization skills, 'AWS' on cloud services and infrastructure, and 'Terraform' on infrastructure as code. 
            This approach is necessary because a candidate might have deep expertise in one of these areas (like Docker) but limited knowledge in another (like Terraform). 
            Thus, creating separate criteria for each ensures a clear and accurate assessment of a candidate's specific skills in each of these significant technologies. 
            Avoid grouping these major technologies under any circumstance to ensure precise evaluation of candidate abilities in each distinct area.
        
        3. **Grouping of Related Tools**: Combine technologies or tools that are closely related and often used together into a single criterion. 
            For example, 'Git' and 'GitHub' can be grouped together for version control, and 'React' with 'Next.js' for front-end development. 
            This grouping should be judicious, maintaining relevance and coherence.

        4. **Descriptive Messages**: Each criterion should include a brief message, preferably within 5-6 words, describing the role and importance of the technology or skill in our projects. 
            Never use too long message like 10 words, it's too long. For example, 'JavaScript for client-side scripting' or 'AWS for cloud services'.

        5. **Focus on Relevance**: Prioritize technologies that are central to our projects, including key programming languages, frameworks, and infrastructure elements. 
            Exclude minor tools or libraries unless they hold particular relevance.

        6. **Clear Criteria for Each Technology**: Ensure each criterion is focused and revolves around a single, coherent concept, aiding in accurate candidate assessment.

        7. **Number of Criteria**: Target around 8-10 criteria, but this can vary (6 to 12) depending on the repository's contents, ensuring comprehensive coverage without overcomplication.

        8. **Guidance from Repository Data**: Utilize the provided details on programming languages and technologies in our repositories to guide the inclusion and emphasis of relevant languages and technologies in your criteria.

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
    for name, bytes in languages.items():
        system_message += name + "(" + str(bytes) + " bytes), "

    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": "Perform your task according to the system message. These are the company's repositories and the file contents." + file_content}
            ]
        )
        content = json.loads(completion.choices[0].message.content)
        return content['criteria']
    except Exception as e:
        raise RuntimeError(f"Error generating criteria with OpenAI API: {e}")


def save_checklist_to_db(position_id):
    """
    Saves the generated checklist to the database.
    
    :param position_id: Unique identifier for the position.
    """
    checklist_id = str(uuid.uuid4())
    sql = f"INSERT INTO checklist (id, position_id) VALUES ('{checklist_id}', '{position_id}');"
    try:
        db_cursor.execute(sql)
        return checklist_id
    except Exception as e:
        raise RuntimeError(f"Error saving checklist to postgres: {e}")
    

def save_criteria_to_dynamodb(criteria, checklist_id):
    """
    Saves the generated criteria to the database.
    
    :param criteria: A list of criteria keywords.
    :param checklist_id: Unique identifier for the checklist.
    """
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
            raise RuntimeError(f"Error saving criteria to DynamoDB: {response}")
    except Exception as e:
        raise RuntimeError(f"Error saving criteria to DynamoDB: {e}")


def save_repository_names_to_db(checklist_id, repository_names):
    """
    Saves the repository names to the database.
    
    :param checklist_id: Unique identifier for the checklist.
    :param repository_names: A list of repository names.
    """
    sql = "INSERT INTO checklist_repository (id, checklist_id, repository_name) VALUES"
    for repository_name in repository_names:
        sql += f" ('{str(uuid.uuid4())}', '{checklist_id}', '{repository_name}'),"
    sql = sql[:-1] + ";"
    try:
        db_cursor.execute(sql)
    except Exception as e:
        raise RuntimeError(f"Error saving repository names to postgres: {e}")

def handler(event, context):
    """
    Lambda function entry point to generate criteria from GitHub repositories.

    :param event: The event triggering the lambda, contains request data.
    :param context: The runtime context of the lambda.
    :return: A dictionary with HTTP status code and response body.
    """
    try:
        logger.info('Received generate criteria request')
        connect_to_db()

        body = parse_request_body(event)
        validate_request_body(body, ['position_id', 'repository_names'])
        position_id = body.get('position_id')
        repository_names = body.get('repository_names')

        github_username = get_github_username_from_position_id(position_id)
        github_client = GithubClient(github_username)
        criteria = generate_criteria_by_repositories(github_client, repository_names)
        logger.info(f'Checklist and Criteria generated successfully for position: {position_id}')

        checklist_id = save_checklist_to_db(position_id)
        save_criteria_to_dynamodb(criteria, checklist_id)
        save_repository_names_to_db(checklist_id, repository_names)

        criteria_messages = [criterion['message'] for criterion in criteria]
        body = { 
            "checklist_id": checklist_id,
            "criteria": criteria_messages
        }
        db_conn.commit()
        logger.info('Criteria saved successfully')
        return generate_success_response(body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Criteria generation failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Criteria generation failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    finally:
        db_conn.close()