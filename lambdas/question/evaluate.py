import logging
import urllib

import boto3

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
        response = s3.get_object(Bucket=bucket, Key=key)
        logger.info(f"Content type: {response['ContentType']}")
        return response['ContentType']
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
