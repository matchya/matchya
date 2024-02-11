import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.quiz import QuizRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


# TODO: This lambda must handle searching for keywords and filtering based on position info
def handler(event, context):
    logger.info('Starting lambda execution')

    try:
        logger.info('Retrieving quiz by id...')

        # parsing from the event
        request_parser = RequestParser(event)
        origin = request_parser.parse_header()
        quiz_id = request_parser.parse_request_parameter('id')
        response_generator.origin_domain = origin

        # business logic
        with postgres_client as db_client:
            quiz_repo = QuizRepository(db_client)
            quiz = quiz_repo.retrieve_by_id(quiz_id)

        return response_generator.generate_success_response({
            'quiz': quiz
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving quizzes failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving quizzes failed: {e}')
        return response_generator.generate_error_response(500, str(e))
