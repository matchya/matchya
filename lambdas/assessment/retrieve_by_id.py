import json
import logging

import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_cookie_body, parse_request_parameter

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
        release=f'assessment@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

# Logger
logger = logging.getLogger('retrieve a assessment by assessment id')
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


def retrieve_assessment_by_id_from_db(company_id, assessment_id):
    """
    Retrieves a assessment by assessment id from the database.

    :param company_id: The company ID.
    :param assessment_id: The assessment ID.
    """
    logger.info('Retrieving a assessment by assessment id from db...')
    sql = """
        SELECT 
            assessment.id, assessment.name, assessment.position_type, assessment.position_level, assessment.created_at, 
            question.id, question.text, question.topic, question.difficulty,
            candidate.id, candidate.name, candidate.email,
            interview.status, interview.total_score
        FROM assessment
        LEFT JOIN assessment_question ON assessment.id = assessment_question.assessment_id
        LEFT JOIN question ON assessment_question.question_id = question.id
        LEFT JOIN assessment_candidate ON assessment.id = assessment_candidate.assessment_id
        LEFT JOIN candidate ON assessment_candidate.candidate_id = candidate.id
        LEFT JOIN interview ON interview.assessment_id = assessment.id AND interview.candidate_id = candidate.id
        WHERE assessment.company_id = '%s' AND assessment.id = '%s'
    """ % (company_id, assessment_id)
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        assessment = process_sql_result(result)
        return assessment
    except Exception as e:
        logger.error(f'Failed to retrieve a assessment by assessment id from db: {e}')
        raise RuntimeError('Failed to retrieve a assessment by assessment id from db.')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    """
    if not result:
        raise ValueError('assessment not found.')
    assessment = {
        'id': result[0][0],
        'name': result[0][1],
        'position_type': result[0][2],
        'position_level': result[0][3],
        'created_at': str(result[0][4]),
        'questions': [],
        'candidates': []
    }
    questions = {}
    candidates = {}
    for row in result:
        (question_id, question_text, question_topic, question_difficulty,
         candidate_id, candidate_name, email, status, total_score) = row[5:]
        if question_id and question_id not in questions:
            question = {
                'id': question_id,
                'text': question_text,
                'topic': question_topic,
                'difficulty': question_difficulty
            }
            questions[question_id] = question

        if candidate_id and candidate_id not in candidates:
            candidate = {
                'id': candidate_id,
                'name': candidate_name,
                'email': email,
                'assessment': {
                    'interview_status': status,
                    'total_score': total_score
                }
            }
            candidates[candidate_id] = candidate

    assessment['questions'] = list(questions.values())
    assessment['candidates'] = list(candidates.values())
    return assessment


def handler(event, context):
    try:
        logger.info('Retrieving assessments...')
        connect_to_db()

        logger.info("Parsing the request header...")
        origin = parse_header(event)

        company_id = parse_cookie_body(event)['company_id']
        assessment_id = parse_request_parameter(event, 'id')

        assessment = retrieve_assessment_by_id_from_db(company_id, assessment_id)

        logger.info("Successfully retrieved assessments from a company.")
        data = {
            'assessment': assessment
        }
        return generate_success_response(origin, data)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving a assessment failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving a assessment failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
