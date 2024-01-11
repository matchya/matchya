import logging
import uuid
import json

import psycopg2
import boto3

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body, parse_cookie_body

# Logger
logger = logging.getLogger('create test')
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
    logger.info('Connecting to db...')
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def validate_request_body(body):
    """
    Validates the necessary fields in the test data.

    :param body: The request body containing test data.
    """
    logger.info("Validating the test data...")
    required_fields = ['name', 'position_type', 'position_level']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields.')


def create_test_record(company_id, body):
    """
    Creates a new test record.

    :param body: The request body containing test data.
    :return: The test id.
    """
    logger.info("Creating a new test record...")
    test_id = str(uuid.uuid4())
    sql = """
        INSERT INTO test (id, company_id, name, position_type, position_level)
        VALUES ('%s', '%s', '%s', '%s', '%s');
        """ % (test_id, company_id, body['name'], body['position_type'], body['position_level'])
    db_cursor.execute(sql)
    return test_id


def send_message_to_sqs(body):
    """
    Sends a message to the SQS queue.

    :param body: The body of the message to send.
    :return: The response from the SQS queue.
    """
    logger.info("Sending message to sqs...")
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


def handler(event, context):
    try:
        logger.info('Creating a new test...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        validate_request_body(body)

        company_id = parse_cookie_body(event)['company_id']

        test_id = create_test_record(company_id, body)
        sqs_body = {
            'test_id': test_id,
            'position_type': body['position_type'],
            'position_level': body['position_level']
        }
        send_message_to_sqs(sqs_body)

        db_conn.commit()
        logger.info("Successfully created a new test.")
        data = {
            'test_id': test_id
        }
        return generate_success_response(origin, data)

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Creating a new position failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Creating a new position failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
