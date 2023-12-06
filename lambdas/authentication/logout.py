import json
import logging

from utils.request import parse_header

# Logger
logger = logging.getLogger('login')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False


def handler(event, context):
    """
    Handles user logout by clearing the httpOnly cookie.

    :param event: The event dictionary containing the HTTP request data.
    :param context: The context object providing runtime information.
    :return: A dictionary with a status code and the body of the response.
             The response body contains a message indicating successful logout.
    """
    logger.info(event)

    logger.info('Parsing the header...')
    origin, host = parse_header(event)

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Set-Cookie': f't=; HttpOnly; Domain={host}; Path=/; Max-Age=0; SameSite=None; Secure'
    }

    response = {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'status': 'success'})
    }
    return response
