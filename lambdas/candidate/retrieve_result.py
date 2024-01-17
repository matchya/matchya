import logging

import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_parameter

# Logger
logger = logging.getLogger('retrieve candidate result by result id')
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


def retrieve_interview_result(interview_id):
    """
    Retrieves a candidate with result by result id from the database.

    :param company_id: The company ID.
    :param candidate_result_id: The candidate result ID.
    """
    logger.info('Retrieving a candidate with result by result id from db...')
    sql = """
        SELECT
            c.id AS candidate_id, c.first_name, c.last_name, c.email, c.github_username,
            in.id AS result_id, in.total_score, in.summary, in.created_at AS interview_created_at,
            a.id AS answer_id, a.audio_url, a.score AS answer_score, a.feedback,
            q.id AS question_id, q.text AS question_text, q.topic, q.difficulty,
            m.id AS metric_id, m.name AS metric_name
        FROM
            candidate c
        JOIN
            interview in ON c.id = in.candidate_id
        JOIN
            answer a ON in.id = a.interview_id
        JOIN
            question q ON a.question_id = q.id
        LEFT JOIN
            metric m ON q.id = m.question_id
        WHERE
            in.id = '%s'
        ORDER BY
            q.id;
    """ % interview_id

    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        candidate = process_sql_result(result)
        return candidate
    except Exception as e:
        logger.error(f'Failed to retrieve a candidate with result by result id from db: {e}')
        raise RuntimeError('Failed to retrieve a candidate with result by result id from db.')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    """
    logger.info('Processing the SQL result...')
    if not result:
        raise ValueError('Candidate not found.')

    candidate = {}
    for row in result:
        (candidate_id, first_name, last_name, email, github_username,
         result_id, total_score, summary, interview_created_at,
         answer_id, audio_url, answer_score, feedback,
         question_id, question_text, topic, difficulty,
         metric_id, metric_name) = row

        if candidate_id and candidate_id not in candidate:
            candidate[candidate_id] = {
                'id': candidate_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'github_username': github_username,
                'result': None
            }

        if result_id and not candidate[candidate_id]['result']:
            candidate[candidate_id]['result'] = {
                'id': result_id,
                'total_score': total_score,
                'summary': summary,
                'created_at': str(interview_created_at),
                'answers': {}
            }

        if answer_id and answer_id not in candidate[candidate_id]['result']['answers']:
            candidate[candidate_id]['result']['answers'][answer_id] = {
                'id': answer_id,
                'audio_url': audio_url,
                'score': answer_score,
                'feedback': feedback,
                'question': {
                    'id': question_id,
                    'text': question_text,
                    'topic': topic,
                    'difficulty': difficulty,
                    'metrics': []
                }
            }

        if metric_id:
            metric = {
                'id': metric_id,
                'name': metric_name
            }
            candidate[candidate_id]['result']['answers'][answer_id]['question']['metrics'].append(metric)

    candidate_id = list(candidate.keys())[0]
    answers = candidate[candidate_id]['result']['answers']
    candidate[candidate_id]['result']['answers'] = list(answers.values())

    return candidate


def handler(event, context):
    try:
        logger.info('Retrieving a candidate...')
        connect_to_db()

        interview_id = parse_request_parameter(event, 'interview_id')
        logger.info("Parsing the request header...")
        origin = parse_header(event)

        candidate = retrieve_interview_result(interview_id)

        logger.info("Successfully retrieved a candidate.")
        data = {
            'candidate': candidate
        }
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
