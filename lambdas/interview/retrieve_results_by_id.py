import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.interview import InterviewRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        origin = parser.parse_header()
        response_generator.origin_domain = origin
        interview_id = parser.parse_request_parameter('id')

        # business logic
        with postgres_client as db_client:
            interview_repo = InterviewRepository(db_client)
            interview = interview_repo.retrieve_interview_results_by_id(interview_id)

        return response_generator.generate_success_response({
            'interview': interview
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving interview by id failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving interview by id failed: {e}')
        return response_generator.generate_error_response(500, str(e))
