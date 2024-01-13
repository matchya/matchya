import logging
import json
import urllib
import uuid

import boto3
from openai import OpenAI
client = OpenAI()

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
s3 = boto3.client('s3')


def convert_audio_to_text(audio):
    """
    Converts the audio file to text.

    :param audio: The audio file.
    """
    logger.info("Converting audio to text...")
    try:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio
        )
        logger.info(f"Transcript: {transcript}")
        return transcript
    except Exception as e:
        raise RuntimeError(f'Failed to convert audio to text: {e}')


def handler(event, context):
    """
    Lambda handler.

    :param event: The event data.
    :param context: The context data.
    """
    logger.info(event)
    try:
        logger.info('Received evaluating an answer request')

        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        # test_id = key.split('/')[0]
        # question_id = key.split('/')[1]
        # candidate_id = key.split('/')[2].split('.')[0]

        # logger.info(f"Test ID: {test_id}")
        # logger.info(f"Question ID: {question_id}")
        # logger.info(f"Candidate ID: {candidate_id}")

        object_uri = f's3://{bucket}/{key}'
        transcribe_job_name = 'Test_transcription_' + str(uuid.uuid4())

        transcribe = boto3.client('transcribe')
        response = transcribe.start_transcription_job(
            TranscriptionJobName=transcribe_job_name,
            LanguageCode='en-US',
            MediaFormat='wav',
            Media={
                'MediaFileUri': object_uri
            }
        )

        logger.info(f"Transcribe Response: {response}")

        while True:
            final_response = transcribe.get_transcription_job(TranscriptionJobName=transcribe_job_name)
            if final_response['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                break

        logger.info(f"Final Response: {final_response}")

        transcription_url = final_response["TranscriptionJob"]["Transcript"]["TranscriptFileUri"]
        transcription_file = urllib.request.urlopen(transcription_url).read().decode("utf-8")
        transcription = json.loads(transcription_file)["results"]["transcripts"][0]["transcript"]

        logger.info(f"Transcription URL: {transcription_url}")
        logger.info(f"Transcription File: {transcription_file}")
        logger.info(f"Transcription: {transcription}")
        return {
            'statusCode': 200,
            'body': json.dumps(f'{transcription}')
        }

        # response = s3.get_object(Bucket=bucket, Key=key)
        # audio = response['Body'].read()
        # text = convert_audio_to_text(audio)
        # logger.info("Successfully converted audio to text")

        # return
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
