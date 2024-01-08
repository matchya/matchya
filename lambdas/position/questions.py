import logging

import psycopg2

from config import Config
from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('retrieve questions from position')
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


def get_questions_by_position_id(position_id):
    """
    Retrieves the questions for the position.

    :param position_id: The position id.
    :return: The questions for the position.
    """
    logger.info(f"Retrieving questions for position id: {position_id}...")
    sql = """
        SELECT 
            q.id, q.text, q.topic, q.difficulty,
            m.id, m.name
        FROM question q
        INNER JOIN position_question pq ON pq.question_id = q.id
        INNER JOIN metric m ON m.question_id = q.id
        WHERE pq.position_id = '%s'
    """ % position_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        questions = {}
        for row in result:
            if row[0] not in questions:
                questions[row[0]] = {
                    'id': row[0],
                    'text': row[1],
                    'topic': row[2],
                    'difficulty': row[3],
                    'metrics': []
                }
            questions[row[0]]['metrics'].append({
                'id': row[4],
                'name': row[5]
            })

        return list(questions.values())
    except Exception as e:
        raise RuntimeError(f"Error retrieving questions: {e}")


def handler(event, context):
    logger.info(event)
    try:
        connect_to_db()
        position_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        questions = get_questions_by_position_id(position_id)
        body = {
            'questions': questions
        }
        return generate_success_response(origin, body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f"Failed to retrieve questions (status {str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f"Failed to retrieve questions (status {str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_conn:
            db_conn.close()
