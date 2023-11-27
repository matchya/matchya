import logging

import psycopg2
import boto3

from config import Config
from utils.request import parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('position')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

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
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()

def get_position_by_id(position_id):
    """
    Retrieves the 'message' attribute of criteria for a given position_id from the database.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    # TODO: Get repository names as well
    try:
        db_cursor.execute(f"SELECT id, name FROM position WHERE id = '{position_id}'")
        result = db_cursor.fetchone()
        if not result:
            raise ValueError(f"Position not found for id: {position_id}")
        position = {
            "id": result[0],
            "name": result[1],
        }
        return position
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve position: {e}")
    

def get_repository_names_by_position_id(position_id):
    """
    Retrieves the 'message' attribute of criteria for a given position_id from dynamodb.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    try:
        db_cursor.execute(f"SELECT repository_name FROM position_repository WHERE position_id = '{position_id}'")
        result = db_cursor.fetchall()
        if not result:
            raise ValueError(f"Repository names not found for position_id: {position_id}")
        repository_names = [item[0] for item in result]
        return repository_names
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve repository names: {e}")


def get_criteria_by_position_id(position_id):
    """
    Retrieves id and message attributes of criteria for a given position_id from dynamodb.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    try:
        response = criterion_table.query(
            IndexName='PositionIdIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('position_id').eq(position_id),
            ProjectionExpression='id, message'
        )
        criteria = {}
        for item in response.get('Items', []):
            criteria[item['id']] = item['message']
        if criteria == {}:
            raise ValueError(f"Criteria not found for position_id: {position_id}")
        return criteria
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve criteria messages: {e}")


def get_candidates_by_position_id(position_id, criteria):
    """
    Retrieve candidates and their results for a given position_id from the database.
    
    :param position_id: Unique identifier for the position.
    :return: List of candidates for the given position_id.
    """
    try:
        sql = """
                SELECT 
                    c.first_name, c.last_name, c.email, c.github_username, 
                    cr.total_score, cr.summary, 
                    ac.criterion_id, ac.score, ac.reason
                FROM 
                    candidate c 
                INNER JOIN 
                    candidate_result cr ON c.id = cr.candidate_id 
                INNER JOIN
                    assessment_criteria ac ON cr.id = ac.candidate_result_id
                WHERE
                    cr.position_id = '%s';
            """ % position_id
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        if not result:
            return []
        candidates = []
        email_index_map = {}
        for item in result:
            email = item[2]
            if email not in email_index_map:
                email_index_map[email] = len(candidates)
                candidate = {
                    "first_name": item[0],
                    "last_name": item[1],
                    "email": item[2],
                    "github_username": item[3],
                    "total_score": item[4],
                    "summary": item[5],
                    "assessments": [],
                }
                candidates.append(candidate)
            else:
                candidate = candidates[email_index_map[email]]
            assessment = {
                "criterion": criteria[item[6]],
                "score": item[7],
                "reason": item[8],
            }
            candidate["assessments"].append(assessment)
        return candidates
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve candidates: {e}")


def retrieve(event, context):
    try:
        logger.info(f"Received event: {event}")
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        position = get_position_by_id(position_id)
        repository_names = get_repository_names_by_position_id(position_id)
        criteria = get_criteria_by_position_id(position_id)
        criteria_messages = [criteria[key] for key in criteria]
        candidates = get_candidates_by_position_id(position_id, criteria)
        body = {
            "id": position["id"],
            "name": position["name"],
            "criteria": {
                "repository_names": repository_names,
                "messages": criteria_messages
            },
            "candidates": candidates
        }
        logger.info(f"Retrieved position: {body}")
        return generate_success_response(body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f"Failed to retrieve position (status {str(status_code)}): {e}")
        return generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f"Failed to retrieve position (status {str(status_code)}): {e}")
        return generate_error_response(status_code, str(e))
    finally:
        if db_conn:
            db_conn.close()
