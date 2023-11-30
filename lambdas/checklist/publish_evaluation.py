import json
import logging

import boto3
import psycopg2

from config import Config

from client.github import GithubClient
from utils.response import generate_error_response, generate_success_response
from utils.request import parse_header, parse_request_body, validate_request_body

# Logger
logger = logging.getLogger('publish evaluation')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

# Postgres
db_conn = None
db_cursor = None

# SQS
sqs = boto3.client('sqs')
queue_url = Config.EVALUATION_PROCESSOR_QUEUE_URL


def connect_to_db():
    """
    Reconnects to the database.
    """
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
    global db_cursor
    db_cursor.execute(f"SELECT * FROM checklist WHERE id = '{checklist_id}'")
    return db_cursor.fetchone() is not None


def send_message_to_sqs(body):
    """
    Sends a message to the SQS queue.

    :param body: The body of the message to send.
    :return: The response from the SQS queue.
    """

    try:
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(body)
        )
        if response.get('MessageId') is None:
            raise RuntimeError("Send message failed")
    except Exception as e:
        logger.exception("Send message failed")
        raise e


def user_already_evaluated(checklist_id, candidate_email):
    """
    Checks if a candidate has already been evaluated for a given checklist.

    :param checklist_id: The id of the checklist to check.
    :param candidate_email: The email of the candidate to check.
    :return: True if the candidate has already been evaluated, False otherwise.
    """
    sql = """
        SELECT * FROM candidate c
        JOIN candidate_result cr
        ON c.id = cr.candidate_id
        WHERE cr.checklist_id = %s AND c.email = %s
    """
    db_cursor.execute(sql, (checklist_id, candidate_email))
    return db_cursor.fetchone() is not None


def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    try:
        logger.info("Received evaluate candidate request")
        connect_to_db()
        body = parse_request_body(event)
        origin = parse_header(event)
        validate_request_body(body, ['checklist_id', 'candidate_email', 'candidate_github_username'])
        checklist_id = body.get('checklist_id')
        if not checklist_exists(checklist_id):
            raise RuntimeError(f"Checklist with id {checklist_id} does not exist")

        if not GithubClient.github_user_exists(body.get('candidate_github_username')):
            raise RuntimeError(f"Github user {body.get('candidate_github_username')} does not exist")

        if user_already_evaluated(checklist_id, body.get('candidate_email')):
            raise RuntimeError(f"Candidate {body.get('candidate_email')} has already been evaluated")

        send_message_to_sqs(body)
        logger.info(f"Successfully sent message to SQS {body}")
        return generate_success_response(origin_domain=origin)
    except RuntimeError as e:
        logger.error(e)
        return generate_error_response(origin, 400, str(e))
    except Exception as e:
        logger.error(e)
        return generate_error_response(origin, 500, str(e))
