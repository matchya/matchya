import os

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
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    """
    This function retrieves the interview questions to be displayed to the candidate when they are interviewing.
    It should fetch the list of questions that have yet to be answered by the candidate.
    """
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        origin = parser.parse_header()
        interview_id = parser.parse_request_parameter('id')
        response_generator.origin_domain = origin

        with postgres_client as db_client:
            answer_repo = AnswerRepository(db_client)
            interview_repo = InterviewRepository(db_client)
            interview = interview_repo.retrieve_interview_quizes_by_id(interview_id)
            answers = answer_repo.get_candidate_answers(interview_id)
            # filter out the questions that have been answered
            interview['questions'] = [question for question in interview['questions'] if question['id'] not in [answer['question_id'] for answer in answers]]
        return response_generator.generate_success_response({
            'interview': interview
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Retrieving interview by id failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Retrieving interview by id failed: {e}')
        return response_generator.generate_error_response(500, str(e))
