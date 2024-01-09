import logging

import psycopg2
import boto3

from config import Config
from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('retrieve_candidates')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# DynamoDB
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
criterion_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Criterion')

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


def get_candidates_by_position_id(position_id):
    """
    Retrieves candidates for a given position.

    :param position_id: The position id.
    :return A list of candidates
    """
    logger.info(f"Retrieving checklist status for position: {position_id}")
    sql = """
        SELECT
            can.id AS candidate_id, can.first_name, can.last_name, can.email, can.github_username, 
            cr.id AS candidate_result_id, cr.score, cr.summary
        FROM
            position p
        LEFT JOIN candidate_position cp ON p.id = cp.position_id
        LEFT JOIN candidate_result cr ON cp.candidate_id = cr.candidate_id
        LEFT JOIN candidate can ON cp.candidate_id = can.id
        WHERE
            p.id = '%s'
        ORDER BY
            can.created_at DESC
    """ % position_id
    try:
        db_cursor.execute(sql)
        results = db_cursor.fetchall()
        if not results or len(results) == 0:
            raise ValueError(f"Position not found for id: {position_id}")
        logger.info(f"SQL Result: {results}")
        return process_position_from_sql_results(results)
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve position: {e}")


def process_position_from_sql_results(sql_results):
    """
    Processes sql results from db_cursor.execute(sql) and returns candidates

    :param sql_results: sql results from db_cursor.execute(sql)
    :return: candidates
    """
    logger.info("Processing position from sql results...")
    # if no candidates, return empty list
    if sql_results[0][0] is None:
        return []

    candidate_data = {}
    for row in sql_results:
        (candidate_id, first_name, last_name, email, github_username,
         candidate_result_id, score, summary) = row

        if candidate_id and candidate_id not in candidate_data:
            candidate_data[candidate_id] = {
                'id': candidate_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'github_username': github_username,
                'result': {
                    'id': candidate_result_id,
                    'total_score': score,
                    'summary': summary
                }
            }
    return list(candidate_data.values())


def handler(event, context):
    logger.info(event)
    try:
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        candidates = get_candidates_by_position_id(position_id)
        body = {
            'candidates': candidates
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
