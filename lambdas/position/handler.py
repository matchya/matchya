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


def retrieve(event, context):
    try:
        logger.info(f"Received event: {event}")
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        body = get_position_details_by_id(position_id)
        if not body:
            raise ValueError(f"Position not found for id: {position_id}")
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


def get_position_details_by_id(position_id):
    """
    Retrieves the position details for a given position_id from the database.

    :param position_id: The position_id to retrieve details for.
    :return: Dictionary of position details.
    """
    sql = """
        SELECT
            p.id AS position_id, p.name AS position_name,
            c.id AS checklist_id,
            cr.repository_name,
            can.first_name, can.last_name, can.email, can.github_username, 
            can_res.id AS candidate_result_id, can_res.total_score, can_res.summary,
            ass_crit.criterion_id, ass_crit.score, ass_crit.reason
        FROM
            position p
        LEFT JOIN checklist c ON p.id = c.position_id
        LEFT JOIN checklist_repository cr ON c.id = cr.checklist_id
        LEFT JOIN candidate_result can_res ON c.id = can_res.checklist_id
        LEFT JOIN candidate can ON can_res.candidate_id = can.id
        LEFT JOIN assessment_criteria ass_crit ON can_res.id = ass_crit.candidate_result_id
        WHERE
            p.id = %s
        ORDER BY
            c.created_at DESC, can_res.id;
    """ % position_id

    sql_results = db_cursor.execute(sql)
    return process_position_from_sql_results(sql_results)


def get_criteria_dict_by_checklist_id(checklist_id):
    """
    Retrieves criteria dictionary {id: message} by checklist_id

    :param checklist_id: The checklist_id to retrieve criteria
    :return: Dictionay of criteria
    """
    try:
        response = criterion_table.query(
            IndexName='ChecklistIdIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('checklist_id').eq(checklist_id),
            ProjectionExpression='id, message'
        )
        criteria = {}
        for item in response.get('Items', []):
            criteria[item['id']] = item['message']
        if criteria == {}:
            raise ValueError(f"Criteria not found for checklist_id: {checklist_id}")
        return criteria
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve criteria messages: {e}")

def process_position_from_sql_results(sql_results):
    """
    Processes sql results from db_cursor.execute(sql) and returns position_data
    
    :param sql_results: sql results from db_cursor.execute(sql)
    :return: position_data
    """
    position_data = {}
    for row in sql_results:
        (position_id, position_name, checklist_id, repo_name, first_name, last_name, email, 
         github_username, candidate_result_id, total_score, summary, criterion_id, score, reason) = row

        if position_id not in position_data:
            position_data[position_id] = {'name': position_name, 'checklists': {}}

        if checklist_id not in position_data[position_id]['checklists']:
            criteria_dict = get_criteria_dict_by_checklist_id(checklist_id)
            position_data[position_id]['checklists'][checklist_id] = {
                'id': checklist_id, 
                'repository_names': set(),
                'candidates': {},
                'criteria': criteria_dict  # {id: message}
            }

        position_data[position_id]['checklists'][checklist_id]['repository_names'].add(repo_name)

        candidates = position_data[position_id]['checklists'][checklist_id]['candidates']
        if email not in candidates:
            candidates[email] = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'github_username': github_username,
                'total_score': total_score,
                'summary': summary,
                'assessments': []
            }

        candidates[email]['assessments'].append({
            'criterion_id': criterion_id,
            'score': score,
            'reason': reason
        })

    final_data = []
    for pos_id, pos_info in position_data.items():
        checklists = []
        for chk_id, chk_info in pos_info['checklists'].items():
            chk_info['repository_names'] = list(chk_info['repository_names'])
            chk_info['candidates'] = list(chk_info['candidates'].values())
            checklists.append(chk_info)
        final_data.append({
            'name': pos_info['name'],
            'checklists': checklists
        })

    return final_data[0] if final_data else None
