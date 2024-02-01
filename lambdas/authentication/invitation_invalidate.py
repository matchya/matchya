import os

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
    """
    Lambda handler triggered when the candidate completes the interview.
    Main focus of this lambda is to invalidate the interview access token so the invitation links can't be used again.
    """
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        origin, host = parser.parse_header()
        authorizer_context = parser.parse_authorizer_context()
        response_generator.origin_domain = origin
        response_generator.host_domain = host

        # business logic
        # check if the token exists in dynamodb table
        item = interview_access_token_repo.retrieve_by_candidate_interview_ids(candidate_id=authorizer_context['candidate_id'], interview_id=authorizer_context['interview_id'])
        # invalidate the token
        interview_access_token_repo.update_status(token=item['token'], status='USED')
        return response_generator.generate_success_response()
    except (ValueError, RuntimeError) as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(500, str(e))
