import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.assessment import AssessmentRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    try:
        logger.info('Deleting assessment...')

        # parsing from the event
        request_parser = RequestParser(event)
        origin = request_parser.parse_header()
        company_id = request_parser.parse_cookie_body()['company_id']
        assessment_id = request_parser.parse_request_parameter('id')
        response_generator.origin_domain = origin

        # db operations
        with postgres_client as db_client:
            assessment_repo = AssessmentRepository(db_client)
            assessment_repo.delete_by_id(company_id, assessment_id)

        return response_generator.generate_success_response()
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving a assessment failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving a assessment failed: {e}')
        return response_generator.generate_error_response(500, str(e))
