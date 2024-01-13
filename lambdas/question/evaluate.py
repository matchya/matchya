import logging
import urllib

import boto3
from openai import OpenAI

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
client = OpenAI()


def get_bucket_name_and_key(event):
    """
    Gets the bucket name and key from the event data.

    :param event: The event data.
    """
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    return bucket, key


def download_file_from_s3(bucket, key):
    """
    Downloads a file from S3.

    :param bucket: The bucket name.
    :param key: The key.
    """
    logger.info(f'Downloading {key} from {bucket}...')
    local_file_name = '/tmp/' + key
    s3.download_file(bucket, key, local_file_name)
    return local_file_name


def transcript_from_audio(local_file_name):
    """
    Transcribes an audio file.

    :param local_file_name: The local file name.
    """
    logger.info(f'Transcribing {local_file_name}...')
    audio_file = open(local_file_name, "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    return transcript


def handler(event, context):
    """
    Lambda handler.

    :param event: The event data.
    :param context: The context data.
    """
    logger.info(event)
    try:
        logger.info('Received evaluating an answer request')

        bucket, key = get_bucket_name_and_key(event)
        # test_id, question_id, candidate_id = key.split('/')[0], key.split('/')[1], key.split('/')[2].split('.')[0]

        local_file_name = download_file_from_s3(bucket, key)
        transcript = transcript_from_audio(local_file_name)
        logger.info(f'Transcript: {transcript}')

        return
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
