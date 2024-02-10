import os

from repo.quiz import QuizRepository
from repo.question import QuestionRepository
from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from client.open_ai import QuizGenerator
from entity.quiz import Quiz
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()
quiz_generator = QuizGenerator()


def handler(event, context):
    """
    This lambda is responsible when the user clicks 'Generate with AI' button.
    """
    logger.info('Starting lambda execution')
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin = parser.parse_header()
        response_generator.origin_domain = origin

        # business logic
        topic = body.get('topic')
        difficulty = body.get('difficulty')
        position_type = body.get('position_type')
        position_level = body.get('position_level')
        position_description = body.get('position_description')

        with postgres_client as db_client:
            quiz_repo = QuizRepository(db_client)
            question_repo = QuestionRepository(db_client)
            generated_quiz: Quiz = quiz_generator.generate(topic, difficulty, position_type, position_level, position_description)
            generated_quiz.id = quiz_repo.insert(generated_quiz.context, generated_quiz.topic, generated_quiz.subtopic, generated_quiz.difficulty, generated_quiz.description, is_original=False)
            question_repo.insert_many(generated_quiz.questions, generated_quiz.id)

        return response_generator.generate_success_response({
            'quiz': generated_quiz.to_dict()
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Generating a quiz failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Generating a quiz failed: {e}')
        return response_generator.generate_error_response(500, str(e))
