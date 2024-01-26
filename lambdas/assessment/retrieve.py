import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.assessment import AssessmentRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.basename(__file__))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    try:
        logger.info('Starting the lambda...')

        # parsing from the event
        parser = RequestParser(event)
        origin = parser.parse_header()
        company_id = parser.parse_cookie_body()['company_id']
        response_generator.origin_domain = origin

        # db operations
        with postgres_client as db_client:
            assessment_repo = AssessmentRepository(db_client)
            assessments = assessment_repo.retrieve_by_company_id(company_id)

        return response_generator.generate_success_response({
            'assessments': assessments
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving assessments failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving assessments failed: {e}')
        return response_generator.generate_error_response(500, str(e))
