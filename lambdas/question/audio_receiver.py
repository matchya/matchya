import logging

import boto3

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_form_data_body

# Logger
logger = logging.getLogger('audio receiver')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# S3
s3 = boto3.client('s3')
BUCKET_NAME = f"{Config.ENVIRONMENT}-data-candidate-response"


def validate_request_body(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    logger.info("Validating the company data...")
    required_fields = ['test_id', 'question_id', 'candidate_id', 'audio']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields.')


def save_audio_file_to_s3(body):
    """
    Saves the audio file to S3.

    :param audio: The audio file.
    """
    logger.info("Saving audio file to S3...")
    try:
        logger.info(f"type of body audio  {type(body['audio'])}")
        audio_bytes: bytes = body['audio']

        test_id = body['test_id']
        question_id = body['question_id']
        candidate_id = body['candidate_id']
        audio_file_name = f'{test_id}/{question_id}/{candidate_id}.wav'

        s3.put_object(Bucket=BUCKET_NAME, Key=audio_file_name, Body=audio_bytes)
    except Exception as e:
        raise RuntimeError(f'Failed to save audio file to S3: {e}')


def handler(event, context):
    try:
        logger.info('Recieving audio...')

        logger.info("Parsing the request body...")
        form_data = parse_form_data_body(event)

        logger.info("Parsing the request header...")
        origin = parse_header(event)
        validate_request_body(form_data)

        save_audio_file_to_s3(form_data)

        logger.info("Successfully saved audio file to S3")
        return generate_success_response(origin)

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Storing audio file failed: {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Storing audio file failed: {e}')
        return generate_error_response(origin, status_code, str(e))
