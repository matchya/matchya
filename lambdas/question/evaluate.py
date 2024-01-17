import logging
import urllib
import json
import uuid

import psycopg2
import boto3
from openai import OpenAI

from config import Config

# Logger
logger = logging.getLogger('evaluate answer')
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

# S3
s3 = boto3.resource('s3')

# OpenAI
openai_client = OpenAI()


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


def download_file_from_s3(bucket, key, file_name):
    """
    Downloads a file from S3.

    :param bucket: The bucket name.
    :param key: The key.
    """
    logger.info(f'Downloading {key} from {bucket}...')
    local_file_name = '/tmp/' + file_name
    s3.Bucket(bucket).download_file(key, local_file_name)
    return local_file_name


def transcript_from_audio(local_file_name):
    """
    Transcribes an audio file.

    :param local_file_name: The local file name.
    """
    logger.info(f'Transcribing {local_file_name}...')
    audio_file = open(local_file_name, "rb")
    transcript = openai_client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    logger.info(f'Transcript: {transcript}')
    return transcript


def get_position_type_and_level(assessment_id):
    """
    Gets the position type and level by assessment id from the database.

    :param assessment_id: The assessment id.
    """
    logger.info('Getting the position type and level by assessment id from db...')
    sql = """
        SELECT 
            assessment.position_type, assessment.position_level
        FROM assessment
        WHERE assessment.id = '%s'
    """ % assessment_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        return result[0]
    except Exception as e:
        logger.error(f'Failed to get the position type and level by assessment id from db: {e}')
        raise RuntimeError('Failed to get the position type and level by assessment id from db.')


def get_question(question_id):
    """
    Gets a question by question id from the database.

    :param question_id: The question id.
    """
    logger.info('Getting a question by question id from db...')
    sql = """
        SELECT 
            question.id, question.text, question.topic, question.difficulty,
            metric.name, metric.scoring, metric.weight
        FROM question
        LEFT JOIN metric ON question.id = metric.question_id
        WHERE question.id = '%s'
    """ % question_id
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        question = process_sql_result(result)
        return question
    except Exception as e:
        logger.error(f'Failed to get a question by question id from db: {e}')
        raise RuntimeError('Failed to get a question by question id from db.')


def process_sql_result(result):
    """
    Processes the SQL result.

    :param result: The SQL result.
    """
    if not result:
        raise ValueError('Question not found.')
    question = {
        'id': result[0][0],
        'text': result[0][1],
        'topic': result[0][2],
        'difficulty': result[0][3],
        'metrics': []
    }
    metrics = {}
    for row in result:
        (metric_name, metric_scoring, metric_weight) = row[4:]
        if metric_name not in metrics:
            metric = {
                'name': metric_name,
                'scoring': metric_scoring,
                'weight': metric_weight
            }
            metrics[metric_name] = metric
            question['metrics'].append(metric)
    return question


def get_system_and_user_messages(question, position_type, position_level, answer):
    """
    Gets the system and user messages.

    :param question: The question.
    :param position_type: The position type.
    :param position_level: The position level.
    """
    logger.info('Getting the system and user messages...')
    system_message = """
    You are tasked with evaluating a candidate's answer to a question.
    Question has id, text, topic, difficulty, and metrics. Metrics have name, scoring, and weight.
    Based on the information provided, you must evaluate the candidate's answer.
    
    You are going to give a score to the answer from 1 to 10, and feedback to the candidate.
    The score is calculated based on the metrics and their weights. Each metric has a scoring from 0 to 10, and multiplied by its weight.
    The total score is the sum of all the metrics' scores. For example, if there are 3 metrics with scores 5, 6, and 7, and weights 0.2, 0.3, and 0.5, the total score is 5 * 0.2 + 6 * 0.3 + 7 * 0.5 = 6.4.
    Return the total score in json format with feedback.
    The feedback is calculated based on the score and what the candidate wrote.
    
    Your response should be a JSON object with the following fields:
    {
        "score": <score>, // 0 to 10 calculated based on the metrics and their weights
        "feedback": <feedback> // 2-3 sentences why you gave the score you gave
    }
    """

    user_message = f'Here is the question for position type {position_type} and position level {position_level}:\n'
    user_message += f'Question: {question["text"]}\n'
    user_message += f'Topic: {question["topic"]}\n'
    user_message += f'Difficulty: {question["difficulty"]}\n'
    user_message += 'Metrics:\n'
    for metric in question['metrics']:
        user_message += f'\t{metric["name"]}: {metric["scoring"]} [Weight: {metric["weight"]}]\n'

    user_message += f'Here is the candidate Answer: {answer}\n'
    user_message += 'Evaluate it, and return the score and feedback in json format.\n'
    return system_message, user_message


def get_evaluation_from_gpt(system_message, user_message):
    """
    Gets the evaluation from GPT.

    :param system_message: The system message.
    :param user_message: The user message.
    """
    logger.info('Getting the evaluation from GPT...')
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5
        )
        content = json.loads(completion.choices[0].message.content)
        logger.info(f"Candidate's answer evaluation: {content['score']}, {content['feedback']}")
        return content['score'], content['feedback']
    except Exception as e:
        logger.error(f'Failed to get the evaluation from GPT: {e}')
        raise RuntimeError('Failed to get the evaluation from GPT.')


def get_interview_id(assessment_id, candidate_id):
    """
    If the candidate result exists, returns the candidate result id.
    Otherwise, creates a new candidate result and returns the new candidate result id.

    :param assessment_id: The assessment id.
    :param candidate_id: The candidate id.
    """
    logger.info('Getting the candidate result id...')
    sql = """
        SELECT 
            id
        FROM interview
        WHERE interview.assessment_id = '%s' AND interview.candidate_id = '%s'
    """ % (assessment_id, candidate_id)
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchall()
        if result:
            return result[0][0]
        else:
            id = str(uuid.uuid4())
            sql = """
                INSERT INTO interview (id, assessment_id, candidate_id)
                VALUES ('%s', '%s', '%s');
            """ % (id, assessment_id, candidate_id)
            db_cursor.execute(sql)
            return id
    except Exception as e:
        logger.error(f'Failed to get the interview id: {e}')
        raise RuntimeError('Failed to get the interview id.')


def store_answer_evaluation_to_db(candidate_result_id, question_id, score, feedback, audio_url):
    """
    Stores the answer evaluation to the database.

    :param candidate_result_id: The candidate result id.
    :param question_id: The question id.
    :param score: The score.
    :param feedback: The feedback.
    :param audio_url: The audio url.
    """
    logger.info('Storing the answer evaluation to db...')
    feedback = feedback.replace("'", "''")
    sql = """
        INSERT INTO answer (id, candidate_result_id, question_id, score, feedback, audio_url)
        VALUES ('%s', '%s', '%s', '%s', '%s', '%s');
    """ % (str(uuid.uuid4()), candidate_result_id, question_id, score, feedback, audio_url)
    try:
        db_cursor.execute(sql)
    except Exception as e:
        logger.error(f'Failed to store the answer evaluation to db: {e}')
        raise RuntimeError('Failed to store the answer evaluation to db.')


def handler(event, context):
    """
    Frontend uploads the audio file to S3.
    S3 triggers this lambda function.
    """
    logger.info(event)
    try:
        logger.info('Received evaluating an answer request')
        connect_to_db()

        bucket, key = get_bucket_name_and_key(event)
        assessment_id, question_id, candidate_id = key.split('/')[0], key.split('/')[1], key.split('/')[2].split('.')[0]

        file_name = assessment_id + '_' + question_id + '_' + candidate_id + '.m4a'
        local_file_name = download_file_from_s3(bucket, key, file_name)
        transcript = transcript_from_audio(local_file_name)

        position_type, position_level = get_position_type_and_level(assessment_id)
        question = get_question(question_id)
        system_message, user_message = get_system_and_user_messages(question, position_type, position_level, transcript)
        score, feedback = get_evaluation_from_gpt(system_message, user_message)

        interview_id = get_interview_id(assessment_id, candidate_id)

        audio_url = f'https://{bucket}.s3.amazonaws.com/{key}'
        store_answer_evaluation_to_db(interview_id, question_id, score, feedback, audio_url)

        db_conn.commit()
        logger.info('Evaluating an answer successful')
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Evaluating an answer failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Evaluating an answer failed (status {str(status_code)}): {e}')
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
