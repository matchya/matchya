import json
import logging

import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.email import send_email
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_parameter

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
logger = logging.getLogger('invite candidate')
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


def get_candidate_email(candidate_id):
    """
    Retrieves the candidate's email address.
    """
    logger.info('Retrieving the candidate\'s email address...')
    db_cursor.execute('SELECT email FROM candidate WHERE id = %s', (candidate_id,))
    email = db_cursor.fetchone()[0]
    logger.info('Candidate\'s email address: %s', email)
    return email


def get_interview_id(candidate_id):
    """
    Retrieves the interview id.
    """
    logger.info('Retrieving the interview id...')
    sql = """
        SELECT id
        FROM interview
        WHERE interview.candidate_id = '%s';
    """ % candidate_id
    try:
        db_cursor.execute(sql)
        interview_id = db_cursor.fetchone()[0]
        logger.info('Interview id: %s', interview_id)
        return interview_id
    except Exception as e:
        logger.error(e)
        raise Exception('Interview not found')


def handler(event, context):
    logger.info('Event: %s', event)
    try:
        connect_to_db()
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        logger.info("Parsing the request parameter...")
        candidate_id = parse_request_parameter(event, 'id')

        email = get_candidate_email(candidate_id)
        interview_id = get_interview_id(candidate_id)
        send_email(email, interview_id)

        return generate_success_response(origin)
    except Exception as e:
        logger.error(e)
        return generate_error_response(400, str(e))
