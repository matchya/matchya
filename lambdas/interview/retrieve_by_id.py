import json
import logging

import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
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
        release=f'interview@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

# Logger
logger = logging.getLogger('retrieve interview by id')
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


def retrieve_interview_by_id(interview_id):
    """
    Retrieves a interview by interview id from the database.

    :param interview_id: The interview ID.
    :return: The interview. 
    """
    logger.info('Retrieving a interview by interview id from db...')
    sql = """
        SELECT 
            c.id, c.first_name, c.last_name, 
            a.id, a.name, 
            i.id, i.total_score, i.summary, i.video_url, i.created_at
        FROM interview AS i
        LEFT JOIN candidate AS c ON i.candidate_id = c.id
        LEFT JOIN assessment AS a ON i.assessment_id = a.id
        WHERE i.id = '%s'
    """ % interview_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        interview = process_sql_result(result)
        return interview
    except Exception as e:
        raise RuntimeError(f'Failed to retrieve interview by id: {e}')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    :return: The processed result.
    """
    interview = {}
    for row in result:
        (candidate_id, candidate_first_name, candidate_last_name,
         assessment_id, assessment_name,
         interview_id, interview_total_score, interview_summary, interview_video_url, interview_created_at) = row
        if interview_id not in interview:
            interview[interview_id] = {
                'id': interview_id,
                'total_score': interview_total_score,
                'summary': interview_summary,
                'video_url': interview_video_url,
                'created_at': str(interview_created_at),
                'candidate': {
                    'id': candidate_id,
                    'first_name': candidate_first_name,
                    'last_name': candidate_last_name
                },
                'assessment': {
                    'id': assessment_id,
                    'name': assessment_name
                }
            }
    return list(interview.values())


def handler(event, context):
    try:
        logger.info('Retrieving interview by id...')
        connect_to_db()

        logger.info("Parsing the request header...")
        origin = parse_header(event)

        logger.info("Parsing the request parameters...")
        interview_id = parse_request_parameter(event, 'id')
        interview = retrieve_interview_by_id(interview_id)

        data = {
            'interviews': interview
        }
        logger.info("Successfully retrieved interview by id.")
        return generate_success_response(origin, data)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving interview by id failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving interview by id failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
