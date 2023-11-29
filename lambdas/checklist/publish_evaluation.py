import json
import logging

import boto3
import psycopg2


from config import Config

from utils.response import generate_success_response, generate_error_response
from utils.request import parse_request_body, validate_request_body

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
queue_url = Config.EVALUATION_QUEUE_URL


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
    except Exception as e:
        logger.exception("Send message failed")
        raise e
    else:
        return response


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
        validate_request_body(body, ['checklist_id', 'candidate_email', 'candidate_github_username'])
        checklist_id = body.get('checklist_id')
        if not checklist_exists(checklist_id):
            raise RuntimeError(f"Checklist with id {checklist_id} does not exist")
  
        res = send_message_to_sqs(body)
        return generate_success_response(res)
    except Exception as e:
        logger.error(e)
        return generate_error_response(400, str(e))
