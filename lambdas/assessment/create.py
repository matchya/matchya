import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from client.sqs import SqsClient
from config import Config
from entity.assessment import Assessment
from repo.assessment import AssessmentRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
sqs_client = SqsClient(queue_url=Config.QUESTION_GENERATION_PROCESSOR_QUEUE_URL)
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    try:
        logger.info('handler')

        # initialize the parser, generators
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin = parser.parse_header()
        company_id = parser.parse_cookie_body()['company_id']
        response_generator.origin_domain = origin

        # business logic
        assessment = Assessment(body.get('name'), body.get('position_type'), body.get('position_level'), body.get('topics'))

        # db operations
        with postgres_client as db_client:
            assessment_repo = AssessmentRepository(db_client)
            assessment.id = assessment_repo.insert(company_id, assessment)
            sqs_client.publish_questions(assessment)
            db_client.commit()

        return response_generator.generate_success_response({
            'assessment_id': assessment.id
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Creating a new position failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Creating a new position failed: {e}')
        return response_generator.generate_error_response(500, str(e))
