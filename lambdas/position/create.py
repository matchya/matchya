import logging
import uuid

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body

# Logger
logger = logging.getLogger('google authentication')
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


def create_position_record(body) -> str:
    """
    Creates a new position record in the database.

    :param body: The request body containing the position data.
    :return: The id of the newly created position record.
    """
    logger.info("Creating a position record...")
    name = body['type'] + ' ' + body['level']
    sql = "INSERT INTO position (id, company_id, name, type, level) VALUES (%s, %s, %s, %s, %s);"
    try:
        position_id = str(uuid.uuid4())
        db_cursor.execute(sql, (position_id, body['company_id'], name, body['type'], body['level']))
        return position_id
    except Exception as e:
        raise RuntimeError(f"Error saving to position table: {e}")


def validate_request_body(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    logger.info("Validating the company data...")
    required_fields = ['company_id', 'type', 'level']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields.')


def handler(event, context):
    try:
        logger.info('Creating a new position...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        validate_request_body(body)

        position_id = create_position_record(body)

        db_conn.commit()
        logger.info("Successfully created a new position.")
        data = {
            'position_id': position_id
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
        db_conn.close()
