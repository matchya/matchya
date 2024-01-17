import logging
import json

import psycopg2
from openai import OpenAI

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body, validate_request_body


# Logger
logger = logging.getLogger('evaluate candidate answers')
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

# OpenAI
chat_client = OpenAI()


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


def get_interview_id(assessment_id, candidate_id):
    """
    Retrieves the interview ID from the database.

    :param assessment_id: The assessment ID.
    :param candidate_id: The candidate ID.
    """
    logger.info('Retrieving interview ID from db...')
    sql = """
        SELECT id
        FROM interview
        WHERE assessment_id = '%s' AND candidate_id = '%s'
    """ % (assessment_id, candidate_id)
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        return result[0]
    except Exception as e:
        logger.error(f'Failed to retrieve interview ID from db: {e}')
        raise RuntimeError('Failed to retrieve interview ID from db, candidate might not have started the assessment.')


def get_candidate_answers(assessment_id, interview_id):
    """
    Retrieves the candidate answers from the database.

    :param assessment_id: The assessment ID.
    :param interview_id: The interview ID.
    """
    logger.info('Retrieving candidate answers from db...')
    sql = """
    SELECT 
        answer.score, answer.feedback, question.text
    FROM answer
    LEFT JOIN interview ON answer.interview_id = interview.id
    LEFT JOIN question ON answer.question_id = question.id
    WHERE interview.assessment_id = '%s' AND interview.id = '%s'
    """ % (assessment_id, interview_id)
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        logger.info(f"SQL result: {result}")
        answers = []
        for row in result:
            answer = {
                'score': row[0],
                'feedback': row[1],
                'question': row[2]
            }
            answers.append(answer)
        return answers
    except Exception as e:
        logger.error(f'Failed to retrieve candidate answers from db: {e}')
        raise RuntimeError('Failed to retrieve candidate answers from db.')


def calculate_total_score(answers):
    """
    Calculates the total score of the candidate.

    :param answers: The candidate answers.
    """
    logger.info('Calculating total score...')
    total_score = 0
    for answer in answers:
        total_score += answer['score']
    result = total_score / len(answers)
    return round(result, 2)


def get_system_and_user_message(answers):
    """
    Generates the system and user message for GPT.

    :param answers: The candidate answers.
    """
    logger.info('Generating system and user message for GPT...')
    system_message = """
    You are tasked to write a summary of the candidate's answers and give a final evaluation.
    You will be provided 'question', 'feedback' and 'score' for each answer.
    Feedback is an evaluation of the answer, and score is the score of the answer from 0 to 10. 10 being the best.
    Your summary should be 3-5 sentences long, describing the candidate's performance, strengths and weaknesses.
    Your response is expected to be this json format:
    {
        "summary": "The summary of the candidate's answers."
    }
    """
    user_message = 'Here is a list of the candidate answers: \n'
    for answer in answers:
        user_message += f'Question: {answer["question"]}\n'
        user_message += f'Feedback: {answer["feedback"]}\n'
        user_message += f'Score: {answer["score"]}\n\n'
    user_message += 'Please write a summary of the candidate\'s answers and give a final evaluation.'

    return system_message, user_message


def get_summary_from_gpt(system_message, user_message):
    """
    Generates a summary from the candidate answers.

    :param answers: The candidate answers.
    """
    logger.info('Generating summary from GPT...')
    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5
        )
        content = json.loads(completion.choices[0].message.content)
        logger.info(f"Summary: {content['summary']}")
        return content['summary']
    except Exception as e:
        logger.error(f'Failed to get the summary from GPT: {e}')
        raise RuntimeError('Failed to get the summary from GPT.')


def save_candidate_result(candidate_result_id, total_score, summary):
    """
    Saves the candidate result to the database.

    :param candidate_result_id: The candidate result ID.
    :param total_score: The total score.
    :param summary: The summary.
    """
    logger.info('Saving candidate result to db...')
    summary = summary.replace("'", "''")
    sql = """
        UPDATE interview
        SET total_score = %s, summary = %s
        WHERE id = %s
    """
    try:
        db_cursor.execute(sql, (total_score, summary, candidate_result_id))
    except Exception as e:
        logger.error(f'Failed to save candidate result to db: {e}')
        raise RuntimeError('Failed to save candidate result to db.')


def handler(event, context):
    try:
        logger.info('Getting final evaluation of a candidate...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin = parse_header(event)
        logger.info("Validating the body data...")
        validate_request_body(body, ['assessment_id', 'candidate_id'])

        interview_id = get_interview_id(body['assessment_id'], body['candidate_id'])
        answers = get_candidate_answers(body['assessment_id'], interview_id)

        total_score = calculate_total_score(answers)
        system_message, user_message = get_system_and_user_message(answers)
        summary = get_summary_from_gpt(system_message, user_message)

        save_candidate_result(interview_id, total_score, summary)

        body = {
            'interview_id': interview_id
        }
        db_conn.commit()
        logger.info("Successfully evaluated a candidate.")
        return generate_success_response(origin, body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Getting final evaluation of a candidate faild: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Getting final evaluation of a candidate faild: {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
