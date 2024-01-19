import logging
import json
import urllib

import psycopg2
from openai import OpenAI

from config import Config
from utils.request import parse_request_parameter


# Logger
logger = logging.getLogger('evaluate interview')
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


def get_bucket_name_and_key(event):
    """
    Gets the bucket name and key from the event data.

    :param event: The event data.
    """
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    return bucket, key


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


def get_candidate_answers(interview_id):
    """
    Retrieves the candidate answers from the database.
    
    :param interview_id: The interview ID.
    """
    logger.info('Retrieving candidate answers from db...')
    sql = """
    SELECT 
        answer.score, answer.feedback, question.text
    FROM answer
    LEFT JOIN interview ON answer.interview_id = interview.id
    LEFT JOIN question ON answer.question_id = question.id
    WHERE AND interview.id = '%s'
    """ % interview_id
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


def save_interview_result(interview_id, total_score, summary):
    """
    Saves the interivew result to the database.

    :param interview_id: The interview ID.
    :param total_score: The total score.
    :param summary: The summary.
    """
    logger.info('Saving interview result to db...')
    summary = summary.replace("'", "''")
    sql = """
        UPDATE interview
        SET total_score = %s, summary = %s, status = 'COMPLETED'
        WHERE id = %s
    """
    try:
        db_cursor.execute(sql, (total_score, summary, interview_id))
    except Exception as e:
        logger.error(f'Failed to update interview result to db: {e}')
        raise RuntimeError('Failed to update interview result to db.')


def handler(event, context):
    try:
        logger.info('Getting final interview result...')
        connect_to_db()

        logger.info("Parsing the request parameters...")
        interview_id = parse_request_parameter(event, 'id')

        answers = get_candidate_answers(interview_id)

        total_score = calculate_total_score(answers)
        system_message, user_message = get_system_and_user_message(answers)
        summary = get_summary_from_gpt(system_message, user_message)

        save_interview_result(interview_id, total_score, summary)

        db_conn.commit()
        logger.info("Successfully evaluated an interview.")
    except (ValueError, RuntimeError) as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
    except Exception as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
