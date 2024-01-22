import json
import logging
import uuid

import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body, validate_request_body
from utils.email import send_email

# Load and parse package.json
with open('package.json') as f:
    package_json = json.load(f)

# Get the version
version = package_json.get('version', 'unknown')

if Config.SENTRY_DSN:
    sentry_sdk.init(
        dsn=Config.SENTRY_DSN,
        environment=Config.ENVIRONMENT,
        integrations=[AwsLambdaIntegration(timeout_warning=True)],
        release=f'candidate@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

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
    sql = "INSERT INTO candidate (id, name, email) VALUES (%s, %s, %s);"
    try:
        candidate_id = str(uuid.uuid4())
        db_cursor.execute(sql, (candidate_id, body['name'], body['email']))
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


def save_assessment_candidate(assessment_id, candidate_id):
    """
    Register the candidate to assessment.

    :param assessment_id: The id of the assessment.
    :param candidate_id: The id of the candidate.
    """
    logger.info("Registering the candidate to assessment...")
    sql = "INSERT INTO assessment_candidate (assessment_id, candidate_id) VALUES (%s, %s);"
    try:
        db_cursor.execute(sql, (assessment_id, candidate_id))
    except Exception as e:
        raise RuntimeError(f"Error registering to assessment_candidate table: {e}")


def create_new_interview(assessment_id, candidate_id):
    """
    Creates a new interview record.

    :param assessment_id: The id of the assessment.
    :param candidate_id: The id of the candidate.
    :return: The id of the newly created interview record.
    """
    # TODO: generate quetions for the interview... not in the MVP
    logger.info("Creating a new interview record...")
    sql = "INSERT INTO interview (id, assessment_id, candidate_id) VALUES (%s, %s, %s);"
    try:
        interview_id = str(uuid.uuid4())
        db_cursor.execute(sql, (interview_id, assessment_id, candidate_id))
        return interview_id
    except Exception as e:
        raise RuntimeError(f"Error saving to interview table: {e}")


def handler(event, context):
    try:
        logger.info('Creating a candidate...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        logger.info("Validating the candidate data...")
        validate_request_body(body, ['email', 'name', 'assessment_id'])

        if not candidate_exists(body['email']):
            candidate_id = create_candidate_record(body)
        else:
            candidate_id = get_candidate_id(body['email'])

        assessment_id = body['assessment_id']
        save_assessment_candidate(assessment_id, candidate_id)
        interview_id = create_new_interview(assessment_id, candidate_id)

        send_email(body['email'], interview_id)

        data = {
            'candidate_id': candidate_id
        }
        db_conn.commit()
        logger.info("Successfully add a candidate.")
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
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
