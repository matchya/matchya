import logging
import jwt
from http.cookies import SimpleCookie

from config import Config

# Logger
logger = logging.getLogger('authorize')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False


def handler(event, context):
    logger.info(event)
    headers = event.get('headers', {})
    cookie_header = headers.get('Cookie', '')
    cookie = SimpleCookie(cookie_header)
    jwt_token = cookie['t'].value if 't' in cookie else None

    # TODO: implement logic to validate if jwt token is still valid

    if jwt_token:
        try:
            decoded_payload = jwt.decode(jwt_token, Config.JWT_SECRET_KEY, algorithms=["HS256"])

            return generate_policy('user', 'Allow', event['methodArn'], decoded_payload)
        except jwt.ExpiredSignatureError:
            return generate_policy('user', 'Deny', event['methodArn'], None)
        except jwt.InvalidTokenError:
            return generate_policy('user', 'Deny', event['methodArn'], None)


def generate_policy(principal_id, effect, resource, context=None):
    logger.info(f"Generating {effect} policy...")
    auth_response = {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resource
            }]
        }
    }

    if context:
        auth_response['context'] = context

    return auth_response
