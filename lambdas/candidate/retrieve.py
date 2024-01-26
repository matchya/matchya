import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.candidate import CandidateRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    logger.info('Starting lambda execution')
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        company_id = parser.parse_cookie_body()['company_id']
        origin = parser.parse_header()
        response_generator.origin_domain = origin

        # business logic
        with postgres_client as db_client:
            candidate_repo = CandidateRepository(db_client)
            candidates = candidate_repo.retrieve_many_by_company_id(company_id)

        return response_generator.generate_success_response({
            'candidates': [candidate.to_dict() for candidate in candidates]
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving candidates failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving candidates failed: {e}')
        return response_generator.generate_error_response(500, str(e))
