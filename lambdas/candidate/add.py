import logging
import uuid

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body

# Logger
logger = logging.getLogger('add candidate')
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


def validate_request_body(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    logger.info("Validating the company data...")
    required_fields = ['email', 'first_name', 'last_name', 'position_id']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields.')


def candidate_exists(email):
    """
    Checks if a candidate exists in the database.

    :param email: The email of the candidate.
    :return: True if the candidate exists, False otherwise.
    """
    logger.info("Checking if candidate exists...")
    sql = "SELECT id FROM candidate WHERE email = %s;"
    db_cursor.execute(sql, (email,))
    result = db_cursor.fetchone()
    return result is not None


def create_candidate_record(body) -> str:
    """
    Creates a new candidate record in the database.

    :param body: The request body containing the candidate data.
    :return: The id of the newly created candidate record.
    """
    logger.info("Creating a candidate record...")
    sql = "INSERT INTO candidate (id, first_name, last_name, email, github_username) VALUES (%s, %s, %s, %s, %s);"
    try:
        candidate_id = str(uuid.uuid4())
        github_username = body.get('github_username', '')
        db_cursor.execute(sql, (candidate_id, body['first_name'], body['last_name'], body['email'], github_username))
        return candidate_id
    except Exception as e:
        raise RuntimeError(f"Error saving to candidate table: {e}")


def get_candidate_id(email):
    """
    Gets the id of a candidate.

    :param email: The email of the candidate.
    :return: The id of the candidate.
    """
    logger.info("Getting the id of the candidate...")
    sql = "SELECT id FROM candidate WHERE email = %s;"
    db_cursor.execute(sql, (email,))
    result = db_cursor.fetchone()
    return result[0]


def save_candidate_position(candidate_id, position_id):
    """
    Saves a candidate's position. If the candidate already has a position, nothing will be done.

    :param candidate_id: The id of the candidate.
    :param position_id: The id of the position.
    """
    logger.info("Saving the candidate's position...")
    sql = "INSERT INTO candidate_position (candidate_id, position_id) VALUES (%s, %s);"
    try:
        db_cursor.execute(sql, (candidate_id, position_id))
    except Exception as e:
        raise RuntimeError(f"Error saving to candidate_position table: {e}")


def handler(event, context):
    try:
        logger.info('Creating a candidate...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        validate_request_body(body)

        if not candidate_exists(body['email']):
            candidate_id = create_candidate_record(body)
        else:
            candidate_id = get_candidate_id(body['email'])

        position_id = body['position_id']

        save_candidate_position(candidate_id, position_id)

        db_conn.commit()
        logger.info("Successfully add a candidate.")
        data = {
            'candidate_id': candidate_id
        }
        return generate_success_response(origin, data)

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Adding a new candidate failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Adding a new candidate failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        db_conn.close()
