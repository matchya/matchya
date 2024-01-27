import os

from client.dynamodb import DynamodbClient
from client.sentry import SentryClient
from repo.interview_access_token import InterviewAccessTokenRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
dynamodb_client = DynamodbClient()
response_generator = ResponseGenerator()
interview_access_token_repo = InterviewAccessTokenRepository(dynamodb_client)


def handler(event, context):
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin = parser.parse_header()
        response_generator.origin_domain = origin
        logger.info(f'test1: {body}')
        token = body.get('token')

        # business logic
        # check if the token exists in dynamodb table
        item = interview_access_token_repo.retrieve_by_token(token=token)
        # check if the token is valid by checking the status to see if it is 'Active'
        if item.get('status') != 'Active':
            raise ValueError('Invalid token')
        
        interview_access_token_repo.update_status(token=token, status='Used')

        return response_generator.generate_success_response({
            'token': token
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(500, str(e))
