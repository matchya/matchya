import os

from repo.interview import InterviewRepository
from client.postgres import PostgresDBClient
from client.sentry import SentryClient
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
        company_id = parser.parse_cookie_body()['company_id']
        origin = parser.parse_header()
        response_generator.origin_domain = origin

        # business logic
        with postgres_client as db_client:
            interview_repo = InterviewRepository(db_client)
            interviews = interview_repo.retrieve_interviews(company_id)

        logger.info("Successfully retrieved interviews.")
        return response_generator.generate_success_response({
            'interviews': interviews
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving interviews failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving interviews failed: {e}')
        return response_generator.generate_error_response(500, str(e))
