import json
import logging

logger = logging.getLogger('publish_generation')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

COMMON_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': True,
    "Content-Type": "application/json",
}


def hello(event, context):
    logger.info(event)
    body = {
        "message": "Hello endpoint! Your function executed successfully!",
        "input": event,
    }
    origin = event['headers'].get('origin')
    if not origin:
        return {"statusCode": 400, "body": "Origin doesn't exist", "headers": COMMON_HEADERS}

    COMMON_HEADERS['Access-Control-Allow-Origin'] = origin

    return {"statusCode": 200, "body": json.dumps(body), "headers": COMMON_HEADERS}
