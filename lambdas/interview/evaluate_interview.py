import os

from client.open_ai import SummaryGenerator
from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from repo.answer import AnswerRepository
from repo.interview import InterviewRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
summary_generation_client = SummaryGenerator()
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def calculate_total_score(answers):
    """
    Calculates the total score of the candidate.

    :param answers: The candidate answers.
    """
    logger.info(f'Calculating total score for answers: {answers}')
    total_score = 0
    for answer in answers:
        total_score += answer['score']
    if len(answers) == 0:
        return 0
    result = total_score / len(answers)
    return round(result, 2)


def handler(event, context):
    logger.info('Starting lambda execution')
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        origin = parser.parse_header()
        interview_id = parser.parse_request_parameter('id')
        response_generator.origin_domain = origin

        # business logic
        with postgres_client as db_client:
            answer_repo = AnswerRepository(db_client)
            interview_repo = InterviewRepository(db_client)
            answers = answer_repo.get_candidate_answers(interview_id)
            total_score = calculate_total_score(answers)
            summary = summary_generation_client.generate(answers)
            interview_repo.update_interview(interview_id, total_score, summary)

        logger.info("Successfully evaluated an interview.")
        return response_generator.generate_success_response({
            'interview_id': interview_id
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Getting final evaluation of an interview faild: {e}')
        return response_generator.generate_error_response(500, str(e))
