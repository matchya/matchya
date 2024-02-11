import os
import time

from client.dynamodb import DynamoDBClient
from client.sentry import SentryClient
from repo.interview_access_token import InterviewAccessTokenRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator
from utils.token_generator import TokenGenerator


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
dynamodb_client = DynamoDBClient(table_name='InterviewAccessToken')
response_generator = ResponseGenerator()
token_generator = TokenGenerator()
interview_access_token_repo = InterviewAccessTokenRepository(dynamodb_client)


def handler(event, context):
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin, host = parser.parse_header()
        response_generator.origin_domain = origin
        response_generator.host_domain = host
        token = body.get('token')

        # business logic
        # check if the token exists in dynamodb table
        item = interview_access_token_repo.retrieve_by_token(token=token)
        # create jwt session token with expiry time
        session_token = token_generator.generate_interview_session_token(candidate_id=item.get('candidate_id'),
                                                                         interview_id=item.get('interview_id'))
        return response_generator.generate_success_response({
            'session_token': session_token
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(500, str(e))
