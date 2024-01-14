import logging

import psycopg2
import boto3

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_cookie_body, parse_request_parameter

# Logger
logger = logging.getLogger('retrieve a test by test id')
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


def retrieve_test_by_id_from_db(company_id, test_id):
    """
    Retrieves a test by test id from the database.

    :param company_id: The company ID.
    :param test_id: The test ID.
    """
    logger.info('Retrieving a test by test id from db...')
    sql = """
        SELECT 
            test.id, test.name, test.position_type, test.position_level, test.created_at, 
            question.id, question.text, question.topic, question.difficulty,
            metric.id, metric.name
        FROM test
        LEFT JOIN test_question ON test.id = test_question.test_id
        LEFT JOIN question ON test_question.question_id = question.id
        LEFT JOIN metric ON question.id = metric.question_id
        WHERE test.company_id = '%s' AND test.id = '%s'
    """ % (company_id, test_id)
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        test = process_sql_result(result)
        return test
    except Exception as e:
        logger.error(f'Failed to retrieve a test by test id from db: {e}')
        raise RuntimeError('Failed to retrieve a test by test id from db.')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    """
    if not result:
        raise ValueError('Test not found.')
    test = {
        'id': result[0][0],
        'name': result[0][1],
        'position_type': result[0][2],
        'position_level': result[0][3],
        'created_at': str(result[0][4]),
        'questions': []
    }
    questions = {}
    for row in result:
        (question_id, question_text, question_topic, question_difficulty, metric_id, metric_name) = row[5:]
        if question_id and question_id not in questions:
            question = {
                'id': question_id,
                'text': question_text,
                'topic': question_topic,
                'difficulty': question_difficulty,
                'metrics': []
            }
            questions[question_id] = question
            questions[question_id]['metrics'] = []

        if metric_id and metric_id not in questions[question_id]['metrics']:
            metric = {
                'id': metric_id,
                'name': metric_name
            }
            questions[question_id]['metrics'].append(metric)

    test['questions'] = list(questions.values())
    return test


def handler(event, context):
    try:
        logger.info('Retrieving tests...')
        connect_to_db()

        logger.info("Parsing the request header...")
        origin = parse_header(event)

        company_id = parse_cookie_body(event)['company_id']
        test_id = parse_request_parameter(event, 'id')

        test = retrieve_test_by_id_from_db(company_id, test_id)

        logger.info("Successfully retrieved tests from a company.")
        data = {
            'test': test
        }
        return generate_success_response(origin, data)

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving a test failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving a test failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
