import json
import logging
from http.cookies import SimpleCookie

import jwt
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config

# Load and parse package.json
with open('package.json') as f:
    package_json = json.load(f)

# Get the version
version = package_json.get('version', 'unknown')

if Config.SENTRY_DSN:
    sentry_sdk.init(
        dsn=Config.SENTRY_DSN,
        environment=Config.ENVIRONMENT,
        integrations=[AwsLambdaIntegration(timeout_warning=True)],
        release=f'authorizer@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

# Logger
logger = logging.getLogger('authorize')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False


def generate_policy(principal_id, effect, resource, context=None):
    logger.info(f"Generating {effect} policy...")
    auth_response = {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': "*"
            }]
        }
    }

    if context:
        auth_response['context'] = context

    return auth_response


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
