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
logger = logging.getLogger('retrieve interview results by id')
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


def retrieve_interview_results_by_id(interview_id):
    """
    Retrieves a interview results by interview id from the database.

    :param interview_id: The interview ID.
    :return: The interview data.
    """
    logger.info('Retrieving a interview results by interview id from db...')
    sql = """  
        SELECT
            i.id, i.total_score, i.summary, i.created_at,
            c.id, c.name, c.email,
            a.id, a.name,
            q.id, q.text, q.topic, q.difficulty, 
            ans.video_url, ans.feedback, ans.score
        FROM interview i
        LEFT JOIN assessment a ON a.id = i.assessment_id
        LEFT JOIN candidate c ON c.id = i.candidate_id
        LEFT JOIN assessment_question aq ON aq.assessment_id = a.id
        LEFT JOIN question q ON q.id = aq.question_id
        LEFT JOIN answer ans ON ans.question_id = q.id
        WHERE i.id = '%s' AND i.status = 'COMPLETED';
    """ % interview_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        return process_sql_result(result)
    except Exception as e:
        logger.error(f'Retrieving a interview results by interview id from db failed: {e}')
        raise RuntimeError('Failed to retrieve a interview results by interview id from db.')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    :return: The processed result.
    """

    if not result:
        raise ValueError('Interview results not found.')

    interview = {
        'id': result[0][0],
        'total_score': result[0][1],
        'summary': result[0][2],
        'created_at': str(result[0][3]),
        'candidate': {
            'id': result[0][4],
            'name': result[0][5],
            'email': result[0][6],
        },
        'assessment': {
            'id': result[0][7],
            'name': result[0][8],
        },
        'answers': [],
    }

    for row in result:
        (question_id, question_text, question_topic, question_difficulty, 
         video_url, feedback, score) = row[9:]
        if question_id and video_url:
            answer = {
                'question_id': question_id,
                'question_text': question_text,
                'question_topic': question_topic,
                'question_difficulty': question_difficulty,
                'video_url': video_url,
                'feedback': feedback,
                'score': score,
            }
            interview['answers'].append(answer)

    return interview


def handler(event, context):
    try:
        logger.info('Retrieving interview by id...')
        connect_to_db()

        logger.info("Parsing the request header...")
        origin = parse_header(event)

        logger.info("Parsing the request parameters...")
        interview_id = parse_request_parameter(event, 'id')
        interview = retrieve_interview_results_by_id(interview_id)

        data = {
            'interview': interview
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
