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
            c.id AS checklist_id,
            can.id AS candidate_id, can.first_name, can.last_name, can.email, can.github_username, 
            can_res.total_score, can_res.summary, can_res.status AS candidate_result_status,
            ass_crit.criterion_id, ass_crit.score, ass_crit.reason
        FROM
            position p
        LEFT JOIN checklist c ON p.id = c.position_id
        LEFT JOIN candidate_result can_res ON c.id = can_res.checklist_id
        LEFT JOIN candidate can ON can_res.candidate_id = can.id
        LEFT JOIN assessment_criteria ass_crit ON can_res.id = ass_crit.candidate_result_id
        WHERE
            p.id = '%s'
        ORDER BY
            c.created_at DESC, can_res.id;
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
    # if no checklist or no candidates, return empty list
    if sql_results[0][0] is None or sql_results[0][1] is None:
        return []

    candidate_data = {}
    criteria = None
    for row in sql_results:
        (checklist_id, candidate_id, first_name, last_name, email, github_username,
         total_score, summary, candidate_result_status, criterion_id, score, reason) = row

        if candidate_id not in candidate_data:
            candidate_data[candidate_id] = {
                'id': candidate_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'github_username': github_username,
                'total_score': total_score,
                'summary': summary,
                'status': candidate_result_status,
                'assessments': []
            }

        if email and candidate_result_status == 'succeeded':
            if criteria is None:
                criteria = get_criteria_by_checklist_id(checklist_id)
            criterion = [criterion for criterion in criteria if criterion['id'] == criterion_id][0]
            candidate_data[candidate_id]['assessments'].append({
                'criterion_id': criterion['id'],
                'score': score,
                'reason': reason
            })

    final_data = []
    for can_id, can_info in candidate_data.items():
        final_data.append(can_info)

    return final_data


def get_criteria_by_checklist_id(checklist_id):
    """
    Retrieves criteria dictionary {id: message} by checklist_id

    :param checklist_id: The checklist_id to retrieve criteria
    :return: Dictionay of criteria
    """
    logger.info("Getting the criteria by checklist id...")
    try:
        response = criterion_table.query(
            IndexName='ChecklistIdIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('checklist_id').eq(checklist_id),
            ProjectionExpression='id, message, keywords, created_at'
        )
        criteria = []
        for item in response.get('Items', []):
            criteria.append(item)
        if not criteria:
            raise ValueError(f"Criteria not found for checklist_id: {checklist_id}")
        logger.info("Successfully retrieved criteria")
        return criteria
    except Exception as e:
        logger.error(f"Failed to retrieve criteria: {e}")
        raise RuntimeError(f"Failed to retrieve criteria messages: {e}")


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
