import json
import logging
import uuid
import datetime

import boto3
import psycopg2

from config import Config

from client.github import GithubClient
from utils.response import generate_error_response, generate_success_response
from utils.request import parse_header, parse_request_body, validate_request_body

# Logger
logger = logging.getLogger('publish_generation')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# Postgres
db_conn = None
db_cursor = None

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


def checklist_exists(checklist_id):
    """
    Checks if a checklist exists in the database.

    :param checklist_id: The id of the checklist to check.
    :return: True if the checklist exists, False otherwise.
    """
    logger.info("Checking if checklist exists...")
    global db_cursor
    db_cursor.execute(f"SELECT id FROM checklist WHERE id = '{checklist_id}'")
    return db_cursor.fetchone() is not None


def send_message_to_sqs(body):
    """
    Sends a message to the SQS queue.

    :param body: The body of the message to send.
    :return: The response from the SQS queue.
    """
    logger.info("Sending message to sqs...")
    try:
        response = sqs.send_message(
            QueueUrl=Config.CHECKLIST_EVALUATION_PROCESSOR_QUEUE_URL,
            MessageBody=json.dumps(body)
        )
        if response.get('MessageId') is None:
            raise RuntimeError("Send message failed")
    except Exception as e:
        logger.exception("Send message failed")
        raise e


def user_already_evaluated(checklist_id, candidate_id):
    """
    Checks if the user has already been evaluated.

    :param checklist_id: The id of the checklist to check.
    :param candidate_id: The id of the candidate to check.
    :return: True if the user has already been evaluated, False otherwise.
    """
    logger.info("Checking if user is already evaluated...")
    failed_status = 'failed'
    sql = f"SELECT id FROM candidate_result WHERE checklist_id = '{checklist_id}' AND candidate_id = '{candidate_id}' AND status != '{failed_status}'"
    db_cursor.execute(sql)
    return db_cursor.fetchone() is not None


def save_candidate_info_to_db(body: dict) -> str:
    """
    Saves the candidate's information to the database.

    :param body: The body of the request.
    :return: The id of the candidate.
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
        logger.error(f"Failed to save candidate info: {e}")
        raise RuntimeError("Failed to save candidate info")


def create_candidate_result_to_db(checklist_id, candidate_id) -> (str, str):
    """
    If there is failed candidate result, update the status to scheduled.
    If not, create a new candidate result with status scheduled.

    :param checklist_id: The id of the checklist to save.
    :param candidate_id: The id of the candidate to save.
    :return: The id and created_at of the candidate result.
    """
    logger.info("Saving the candidate result...")
    try:
        new_status = 'scheduled'
        sql = f"SELECT id, created_at FROM candidate_result WHERE checklist_id = '{checklist_id}' AND candidate_id = '{candidate_id}' AND status = 'failed'"
        db_cursor.execute(sql)
        result = db_cursor.fetchone()

        if result:
            logger.info(f"Updating the candidate result status to scheduled, id: {result[0]}")
            sql = f"UPDATE candidate_result SET status = '{new_status}' WHERE id = '{result[0]}'"
            db_cursor.execute(sql)
            return result[0], str(result[1])

        id = str(uuid.uuid4())
        created_at = str(datetime.datetime.now())
        sql = "INSERT INTO candidate_result (id, checklist_id, candidate_id, status, created_at) VALUES (%s, %s, %s, %s, %s)"
        db_cursor.execute(sql, (id, checklist_id, candidate_id, new_status, created_at))
        logger.info(f"New candidate result is saved to db successfully id: {id}")
        return id, created_at
    except Exception as e:
        logger.error(f"Failed to save candidate result: {e}")
        raise RuntimeError("Failed to save candidate result")


def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    logger.info(event)
    try:
        connect_to_db()
        body = parse_request_body(event)
        origin = parse_header(event)
        validate_request_body(body, ['checklist_id', 'candidate_email', 'candidate_github_username'])
        checklist_id = body.get('checklist_id')
        if not checklist_exists(checklist_id):
            raise RuntimeError(f"Checklist with id {checklist_id} does not exist")

        if not GithubClient.github_user_exists(body.get('candidate_github_username')):
            raise RuntimeError(f"Github user {body.get('candidate_github_username')} does not exist")

        candidate_id = save_candidate_info_to_db(body)
        logger.info(f"Saved candidate info to database successfully: {candidate_id}")

        if user_already_evaluated(checklist_id, candidate_id):
            raise RuntimeError(f"Candidate {body.get('candidate_email')} has already been evaluated")

        candidate_result_id, created_at = create_candidate_result_to_db(checklist_id, candidate_id)
        logger.info(f"Saved candidate result to database successfully with status 'scheduled': {candidate_result_id}")

        body['candidate_result_id'] = candidate_result_id
        send_message_to_sqs(body)
        logger.info(f"Successfully sent message to SQS {body}")

        data = {
            "candidate_id": candidate_id,
            "created_at": created_at,
        }
        return generate_success_response(origin_domain=origin, payload=data)
    except RuntimeError as e:
        logger.error(e)
        return generate_error_response(origin, 400, str(e))
    except Exception as e:
        logger.error(e)
        return generate_error_response(origin, 500, str(e))
    finally:
        db_conn.commit()
        if db_conn:
            db_conn.close()
