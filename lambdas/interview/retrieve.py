import logging

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_cookie_body

# Logger
logger = logging.getLogger('retrieve interviews')
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


def retrieve_interviews(company_id):
    """
    Retrieves interviews from the database.

    :param company_id: The id of the company.
    :return: The interviews.
    """
    logger.info("Retrieving interviews...")
    sql = """
        SELECT
            i.id AS interview_id, i.total_score AS interview_total_score, i.created_at AS interview_created_at,
            c.id AS candidate_id, c.first_name AS candidate_first_name, c.last_name AS candidate_last_name,
            a.id AS assessment_id, a.name AS assessment_name
        FROM interview AS i
        LEFT JOIN candidate AS c ON c.id = i.candidate_id
        LEFT JOIN assessment AS a ON a.id = i.assessment_id
        WHERE a.company_id = '%s' AND i.status = 'COMPLETED';
    """ % company_id
    db_cursor.execute(sql)
    result = db_cursor.fetchall()
    interviews = process_sql_result(result)
    return interviews


def process_sql_result(result):
    """
    Processes the SQL result and returns a list of interviews.

    :param result: The SQL result.
    :return: A list of interviews.
    """
    logger.info("Processing the SQL result...")
    interviews = {}
    for row in result:
        (interview_id, interview_total_score, interview_created_at,
         candidate_id, candidate_first_name, candidate_last_name,
         assessment_id, assessment_name) = row

        if interview_id and interview_id not in interviews:
            interviews[interview_id] = {
                'id': interview_id,
                'total_score': interview_total_score,
                'created_at': str(interview_created_at),
                'candidate': {
                    'id': candidate_id,
                    'first_name': candidate_first_name,
                    'last_name': candidate_last_name
                },
            }
            if assessment_id:
                interviews[interview_id]['assessment'] = {
                    'id': assessment_id,
                    'name': assessment_name
                }
    return list(interviews.values())


def handler(event, context):
    try:
        logger.info('Retrieving interviews...')
        connect_to_db()

        logger.info("Parsing body from cookie...")
        company_id = parse_cookie_body(event)['company_id']
        logger.info("Parsing the request header...")
        origin = parse_header(event)

        interviews = retrieve_interviews(company_id)

        data = {
            'interviews': interviews
        }
        logger.info("Successfully retrieved interviews.")
        return generate_success_response(origin, data)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving interviews failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving interviews failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
