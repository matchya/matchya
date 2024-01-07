import logging

import psycopg2
import boto3

from config import Config
from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('position retrieve')
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


def handler(event, context):
    logger.info(event)
    try:
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        body = get_position_details_by_id(position_id)
        if not body:
            raise ValueError(f"Position not found for id: {position_id}")
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


def get_position_details_by_id(position_id):
    """
    Retrieves the position details for a given position_id from the database.

    :param position_id: The position_id to retrieve details for.
    :return: Dictionary of position details.
    """
    logger.info("Getting position details by id...")
    sql = """
        SELECT
            p.id AS position_id, p.name AS position_name, p.checklist_generation_status AS checklist_status,
            c.id AS checklist_id,
            que.id AS question_id, que.text AS question_text, que.topic AS question_topic, que.difficulty AS question_difficulty,
            met.id AS metric_id, met.name AS metric_name,
            cr.repository_name,
            can.id AS candidate_id, can.first_name, can.last_name, can.email, can.github_username, 
            can_res.total_score, can_res.summary, can_res.status AS candidate_result_status, can_res.created_at,
            ass_crit.criterion_id, ass_crit.score, ass_crit.reason
        FROM
            position p
        LEFT JOIN checklist c ON p.id = c.position_id
        LEFT JOIN checklist_repository cr ON c.id = cr.checklist_id
        LEFT JOIN position_question pos_que ON p.id = pos_que.position_id
        LEFT JOIN question que ON que.id = pos_que.question_id
        LEFT JOIN metric met ON met.question_id = que.id
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
    Processes sql results from db_cursor.execute(sql) and returns position_data

    :param sql_results: sql results from db_cursor.execute(sql)
    :return: position_data
    """
    logger.info("Processing position from sql results...")
    # if no checklist, return empty checklist
    if sql_results[0][3] is None:
        return {
            "name": sql_results[0][1],
            "checklist_status": sql_results[0][2],
            "checklists": [],
            "questions": [],
            "candidates": []
        }

    position_data = {}
    for row in sql_results:
        (position_id, position_name, checklist_status, checklist_id, question_id, question_text, question_topic,
         question_difficulty, metric_id, metric_name, repo_name, candidate_id, first_name, last_name, email,
         github_username, total_score, summary, candidate_result_status, created_at, criterion_id, score, reason) = row

        if position_id not in position_data:
            position_data[position_id] = {
                'name': position_name,
                'checklist_status': checklist_status,
                'checklists': {},
                'questions': {},
                'candidates': {}
            }

        if checklist_id not in position_data[position_id]['checklists']:
            criteria = get_criteria_by_checklist_id(checklist_id)
            position_data[position_id]['checklists'][checklist_id] = {
                'id': checklist_id,
                'repository_names': set(),
                'criteria': criteria
            }

        if repo_name:
            position_data[position_id]['checklists'][checklist_id]['repository_names'].add(repo_name)

        if question_id and question_id not in position_data[position_id]['questions']:
            position_data[position_id]['questions'][question_id] = {
                'id': question_id,
                'text': question_text,
                'topic': question_topic,
                'difficulty': question_difficulty,
                'metrics': {}
            }

        if metric_id and metric_id not in position_data[position_id]['questions'][question_id]['metrics']:
            position_data[position_id]['questions'][question_id]['metrics'][metric_id] = {
                'id': metric_id,
                'name': metric_name
            }

        candidates = position_data[position_id]['candidates']
        if email and email not in candidates:
            candidates[email] = {
                'id': candidate_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'github_username': github_username,
                'total_score': total_score,
                'summary': summary,
                'status': candidate_result_status,
                'created_at': str(created_at),
                'assessments': {}
            }

        if email and criterion_id and candidate_result_status == 'succeeded':
            criterion = [criterion for criterion in criteria if criterion['id'] == criterion_id][0]
            candidates[email]['assessments'][criterion['id']] = {
                'criterion': {
                    'id': criterion['id'],
                },
                'score': score,
                'reason': reason
            }

    final_data = []
    for pos_id, pos_info in position_data.items():
        final_checklists = []
        for chk_id, chk_info in pos_info['checklists'].items():
            chk_info['repository_names'] = list(chk_info['repository_names'])
            final_checklists.append(chk_info)

        final_questions = []
        for que_id, que_info in pos_info['questions'].items():
            que_info['metrics'] = list(que_info['metrics'].values())
            final_questions.append(que_info)

        final_candidates = []
        for can_email, can_info in pos_info['candidates'].items():
            can_info['assessments'] = list(can_info['assessments'].values())
            final_candidates.append(can_info)
        final_data.append({
            'name': pos_info['name'],
            'checklist_status': pos_info['checklist_status'],
            'checklist': final_checklists[0],  # Single checklist for now
            'questions': final_questions,
            'candidates': final_candidates
        })

    return final_data[0] if final_data else None


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
