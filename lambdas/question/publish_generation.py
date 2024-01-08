import json
import logging

import boto3
import psycopg2

from config import Config

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
    logger.info("Connecting to db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def questions_already_exist(position_id):
    """
    Checks if questions already exists for the position.

    :param position_id: Unique identifier for the position.
    :return: True if questions already exist, False otherwise.
    """
    logger.info("Checking if questions already exists...")
    sql = f"SELECT id FROM position_question WHERE position_id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        return db_cursor.fetchone() is not None
    except Exception as e:
        raise RuntimeError(f"Error checking if questions already exist in postgres: {e}")


def send_message_to_sqs(body):
    """
    Sends a message to the SQS queue.

    :param body: The body of the message to send.
    :return: The response from the SQS queue.
    """
    logger.info("Sending the message to sqs...")
    try:
        response = sqs.send_message(
            QueueUrl=Config.QUESTION_GENERATION_PROCESSOR_QUEUE_URL,
            MessageBody=json.dumps(body)
        )
        if response.get('MessageId') is None:
            raise RuntimeError("Send message failed")
    except Exception as e:
        logger.exception("Send message failed")
        raise e


def update_generation_status(position_id):
    """
    Updates the generation status of the position to 'scheduled'.

    :param position_id: Unique identifier for the position.
    """
    logger.info("Updating the generation status...")
    sql = """
            UPDATE position
            SET question_generation_status = 'scheduled'
            WHERE id = %s;
        """
    try:
        db_cursor.execute(sql, (position_id,))
        db_conn.commit()
    except Exception as e:
        raise RuntimeError(f"Error updating generation status in postgres: {e}")


def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    try:
        logger.info(event)
        connect_to_db()
        body = parse_request_body(event)
        origin = parse_header(event)
        validate_request_body(body, ['position_id'])

        if questions_already_exist(body['position_id']):
            logger.error(f"Questions for position {body['position_id']} already exists")
            raise RuntimeError(f"Questions for position {body['position_id']} already exists")

        send_message_to_sqs(body)
        logger.info(f"Successfully sent message to SQS {body}")

        update_generation_status(body['position_id'])
        return generate_success_response(origin_domain=origin)
    except RuntimeError as e:
        logger.error(e)
        return generate_error_response(origin, 400, str(e))
    except Exception as e:
        logger.error(e)
        return generate_error_response(origin, 500, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
