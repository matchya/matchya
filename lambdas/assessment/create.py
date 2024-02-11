import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from entity.assessment import Assessment
from repo.assessment import AssessmentRepository
from repo.quiz import QuizRepository
from repo.assessment_quiz import AssessmentQuizRepository
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
        logger.info('handler')

        # initialize the parser, generators
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin = parser.parse_header()
        company_id = parser.parse_cookie_body()['company_id']
        response_generator.origin_domain = origin

        # business logic
        assessment = Assessment(body.get('name'), body.get('position_type'), body.get('position_level'))
        quiz_ids = body.get('quiz_ids', ['1', '2', '3'])

        # db operations
        with postgres_client as db_client:
            assessment_repo = AssessmentRepository(db_client)
            quiz_repo = QuizRepository(db_client)
            assessment_question_repo = AssessmentQuizRepository(db_client)
            assessment.id = assessment_repo.insert(company_id, assessment)
            assessment_question_repo.insert(assessment.id, quiz_ids)
            assessment.quizzes = quiz_repo.retrieve_many_by_ids(quiz_ids)

        return response_generator.generate_success_response({
            'assessment': assessment.to_dict()
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Creating a new position failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Creating a new position failed: {e}')
        return response_generator.generate_error_response(500, str(e))
