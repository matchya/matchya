import logging

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_cookie_body

# Logger
logger = logging.getLogger('retrieve assessments')
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


def retrieve_assessments_from_db(company_id):
    """
    Retrieves assessments from the database.

    :param company_id: The company ID.
    """
    logger.info('Retrieving assessments from db...')
    sql = """
        SELECT 
            t.id, t.name, t.position_type, t.position_level, t.updated_at,
            COUNT(i.candidate_id) AS num_candidates
        FROM 
            assessment t
        LEFT JOIN 
            interview i ON t.id = i.assessment_id
        WHERE 
            t.company_id = '%s'
        GROUP BY 
            t.id, t.name, t.position_type, t.position_level, t.updated_at;
    """ % company_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        assessments = []
        for row in result:
            assessment = {
                'id': row[0],
                'name': row[1],
                'position_type': row[2],
                'position_level': row[3],
                'updated_at': str(row[4]),
                'num_candidates': row[5]
            }
            assessments.append(assessment)
        return assessments
    except Exception as e:
        logger.error(f'Failed to retrieve assessments from db: {e}')
        raise RuntimeError('Failed to retrieve assessments from db.')


def handler(event, context):
    try:
        logger.info('Retrieving assessments...')
        connect_to_db()

        logger.info("Parsing the request header...")
        origin = parse_header(event)

        company_id = parse_cookie_body(event)['company_id']

        assessments = retrieve_assessments_from_db(company_id)

        logger.info("Successfully retrieved assessments from a company.")
        data = {
            'assessments': assessments
        }
        return generate_success_response(origin, data)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Retrieving assessments failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Retrieving assessments failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
