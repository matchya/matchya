import logging

import psycopg2

from config import Config
from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('candidates_status')
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
    logger.info("Connecting to db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_inprogress_candidates(position_id):
    """
    Retrieves the in progress candidates for a given position.
    
    :param position_id: The position id.
    :return A list of candidate emails.
    """
    logger.info(f"Retrieving checklist status for position: {position_id}")
    inprogress_status = 'scheduled'
    sql = """
        SELECT candidate.email
        FROM position
        JOIN checklist ON position.id = checklist.position_id
        JOIN candidate_result ON checklist.id = candidate_result.checklist_id
        JOIN candidate ON candidate_result.candidate_id = candidate.id
        WHERE position.id = %s
        AND candidate_result.status = %s
    """
    db_cursor.execute(sql, (position_id, inprogress_status))
    result = db_cursor.fetchall()
    if not result:
        return []
    return [row[0] for row in result]


def handler(event, context):
    logger.info(event)
    try:
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        in_progress_candidates = get_inprogress_candidates(position_id)
        body = {
            'in_progress_candidates': in_progress_candidates
        }
        return generate_success_response(origin, body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f"Failed to retrieve position (status {str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f"Failed to retrieve position (status {str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_conn:
            db_conn.close()
