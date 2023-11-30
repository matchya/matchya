import json
import logging

import boto3
import psycopg2

from config import Config

from utils.response import generate_error_response, generate_success_response
from utils.request import parse_request_body, validate_request_body

# Logger
logger = logging.getLogger('publish generation')
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
queue_url = Config.GENERATION_PROCESSOR_QUEUE_URL


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


def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    try:
        logger.info("Received publish criteria generation request")
        connect_to_db()
        body = parse_request_body(event)
        validate_request_body(body, ['position_id', 'repository_names'])

        github_username = get_github_username_from_position_id(body['position_id'])
        body['github_username'] = github_username
        send_message_to_sqs(body)
        logger.info(f"Successfully sent message to SQS {body}")
        return generate_success_response()
    except RuntimeError as e:
        logger.error(e)
        return generate_error_response(400, str(e))
    except Exception as e:
        logger.error(e)
        return generate_error_response(500, str(e))
