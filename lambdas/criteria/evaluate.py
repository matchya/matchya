import json
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
logger = logging.getLogger('evaluate candidate')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

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
    try:
        id = str(uuid.uuid4())
        first_name = body.get('candidate_first_name', '')
        last_name = body.get('candidate_last_name', '')
        github_username = body.get('candidate_github_username', '')
        email = body.get('candidate_email', '')
        sql = "INSERT INTO candidate (id, first_name, last_name, github_username, email) VALUES (%s, %s, %s, %s, %s)"
        db_cursor.execute(sql, (id, first_name, last_name, github_username, email))
        return id
    except Exception as e:
        raise RuntimeError(f"Failed to save candidate info: {e}")

def get_criteria_from_dynamodb(checklist_id):
    """
    Retrieves the full message criteria for a checklist.

    :param checklist_id: The ID of the checklist.
    :return: A list of criteria with keywords and message
    """
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
    system_message = "A company is looking for promising employees as software engineers. Candidates need to have a skillset to work on the company's project in terms of programming languages and other technologies. These are criteria that the company needs candidates to have. You need to assess candidates on each criteria with keywords and a message : "

    for i in range(len(criteria)):
        criterion = criteria[i]
        system_message += "\n" + "criterion" + str(i+1) + ". id: " + criterion['id'] + criterion["message"] + " (keywords: " + ", ".join(criterion["keywords"]) + ")"

    system_message += """
        You will be given files from the candidate's GitHub repository. Please evaluate the candidate's skillset based on the files.
        Score each criteria from 0 to 10. 0 means the candidate does not have the skillset at all, and 10 means the candidate has the skillset perfectly.
        The total score is the average of all criteria scores. Please also provide a reason for each score as well.
        When you give a reason, mention the repository name, but never mention the file name.
        Your response will look like this in JSON format:
        {
            "total_score": number, // average score from 0 to 10
            "summary": string, // general comment about the candidate's skillset
            "assessments": [
                {
                    "criterion_id": string, // criterion's id
                    "criterion_message": string, // criterion's message
                    "score": number, // score from 0 to 10
                    "reason": string // reason for the score
                },
                {
                }, ... // other criteria
            ]
        }
    """

    languages_info = "\nHere is the list of programming languages this candidate used. If you can use this as helpful information, use it:"
    for name, bytes in languages.items():
        languages_info += name + "(" + str(bytes) + " bytes), "

    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": "Follow system message instruction. Here are the files from the candidate's GitHub Account: " + file_content + languages_info}
            ]
        )

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
    candidate_result_id = save_candidate_result(checklist_id, candidate_id, candidate_result)
    save_candidate_assessments(candidate_result_id, candidate_result['assessments'])
    

def save_candidate_result(checklist_id, candidate_id, candidate_result):
    """
    Saves candidate evaluation result to database.

    :param checklist_id: The ID of the checklist.
    :param candidate_id: The ID of the candidate.
    :param candidate_result: The candidate's evaluation result.
    """
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
    try:
        logger.info(f"Received evaluate candidate request")
        connect_to_db()

        body = parse_request_body(event)
        validate_request_body(body, ['checklist_id', 'candidate_github_username'])
        candidate_id = save_candidate_info_to_db(body)
        logger.info(f"Saved candidate info to database successfully: {candidate_id}")

        checklist_id = body.get('checklist_id')
        github_username = body.get('candidate_github_username')
        github_client = GithubClient(github_username)

        criteria = get_criteria_from_dynamodb(checklist_id)
        pinned_repositories = github_client.get_pinned_repositories_name()
        candidate_result = evaluate_candidate(github_client, pinned_repositories, criteria)
        logger.info(f"Generated candidate evaluation successfully: score {candidate_result.get('total_score')}")

        save_candidate_evaluation_to_db(checklist_id, candidate_id, candidate_result)
        logger.info(f"Saved candidate evaluation to database successfully")
        db_conn.commit()
        return generate_success_response(candidate_result)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 400
        logger.error(f'Candidate evaluation failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    finally:
        db_conn.close()
