import logging
import boto3
from botocore.exceptions import NoCredentialsError

from config import Config
from utils.response import generate_error_response, generate_success_response
from utils.request import parse_header

# Logger
logger = logging.getLogger('get presigned url')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

s3_client = boto3.client('s3')


def handler(event, context):
    """
    Handles the lambda function call.
    """
    logger.info(event)
    interview_id = event.get('queryStringParameters', {}).get('interview_id', None)
    question_id = event.get('queryStringParameters', {}).get('question_id', None)
    logger.info(f'Interview ID: {interview_id}')
    logger.info(f'Question ID: {question_id}')
    origin = parse_header(event)
    try:
        presigned_url = s3_client.generate_presigned_post(
            Bucket=f'{Config.ENVIRONMENT}-data-question-response-video',
            Key=f'{interview_id}/{question_id}.webm',
            ExpiresIn=3600
        )
        return generate_success_response(origin, presigned_url)
    except NoCredentialsError as e:
        status_code = 400
        return generate_error_response(origin, status_code, str(e))


def generate_hash():
    """
    Generate a hash to be used as filename
    """
    import hashlib
    import uuid
    hash_object = hashlib.sha1(uuid.uuid4().bytes)
    hex_dig = hash_object.hexdigest()
    return hex_dig
