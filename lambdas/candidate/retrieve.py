import logging

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_cookie_body

# Logger
logger = logging.getLogger('retrieve candidates')
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


def retrieve_candidates(company_id):
    """
    Retrieves candidates from the database.

    :param company_id: The id of the company.
    :return: The candidate.
    """
    logger.info("Retrieving a candidates...")
    sql = "SELECT id, email, first_name, last_name FROM candidate WHERE company_id = %s;"
    sql = """
        SELECT 
            can.id, can.email, can.first_name, can.last_name, can.github_username,
            in.id AS result_id, in.assessment_id, in.total_score, in.created_at, 
            assessment.id AS assessment_id, assessment.name AS assessment_name    
        FROM candidate AS can 
        LEFT JOIN interview AS in ON in.candidate_id = can.id
        LEFT JOIN assessment ON assessment.id = in.assessment_id
        LEFT JOIN company_candidate AS com_can ON com_can.candidate_id = can.id
        WHERE com_can.company_id = '%s';
        """ % company_id
    db_cursor.execute(sql, (company_id,))
    result = db_cursor.fetchall()
    candidates = process_sql_result(result)
    return candidates


def process_sql_result(result):
    """
    Processes the SQL result and returns a list of candidates.

    :param result: The SQL result.
    :return: A list of candidates.
    """
    logger.info("Processing the SQL result...")
    candidates = {}
    for row in result:
        (candidate_id, email, first_name, last_name, github_username,
         result_id, assessment_id, total_score, created_at, assessment_id, assessment_name) = row
        if candidate_id and candidate_id not in candidates:
            candidates[candidate_id] = {
                'id': candidate_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'github_username': github_username,
                'result': None
            }
        if result_id:
            candidates[candidate_id]['result'] = {
                'id': result_id,
                'assessment_id': assessment_id,
                'assessment_name': assessment_name,
                'total_score': total_score,
                'created_at': str(created_at)
            }
    candidates = list(candidates.values())
    return candidates


def handler(event, context):
    try:
        logger.info('Retrieving candidates...')
        connect_to_db()

        logger.info("Parsing body from cookie...")
        company_id = parse_cookie_body(event)['company_id']
        logger.info("Parsing the request header...")
        origin = parse_header(event)

        candidates = retrieve_candidates(company_id)

        data = {
            'candidates': candidates
        }
        logger.info("Successfully retrieved candidates.")
        return generate_success_response(origin, data)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving candidates failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving candidates failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
