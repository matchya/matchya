import logging

import psycopg2

from config import Config
from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('checklist_status')
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


def get_checklist_status(position_id):
    """
    Retrieves the status of the checklist for a given position.
    """
    logger.info(f"Retrieving checklist status for position: {position_id}")
    db_cursor.execute(f"SELECT checklist_generation_status FROM position WHERE id = '{position_id}'")
    status = db_cursor.fetchone()
    if not status:
        raise ValueError(f"Position not found for id: {position_id}")
    return status[0]


def handler(event, context):
    logger.info(event)
    try:
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        status = get_checklist_status(position_id)
        body = {
            'status': status
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
