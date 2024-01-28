from http.cookies import SimpleCookie
import os

import jwt

from config import Config
from utils.iam_policy_generator import IAMPolicyGenerator
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.sentry import SentryClient

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())


def handler(event, context):
    logger.info('Starting the lambda execution')

    # initializing the parser
    parser = RequestParser(event)
    iam_policy_generator = IAMPolicyGenerator(principal_id='user')
    try:
        # parsing the event
        cookie_header = parser.parser_cookie_header()
        cookie = SimpleCookie(cookie_header)
        jwt_token = cookie['t'].value if 't' in cookie else None

        # TODO: implement logic to validate if jwt token is still valid
        if jwt_token:
            decoded_payload = jwt.decode(jwt_token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            return iam_policy_generator.generate_policy(effect='Allow', context=decoded_payload)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError) as e:
        logger.error(f'Exception occurred: {e}')
        return iam_policy_generator.generate_policy(effect='Deny', context=None)
