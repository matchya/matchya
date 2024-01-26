import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from entity.candidate import Candidate
from repo.candidate import CandidateRepository
from repo.interview import InterviewRepository
from utils.email import send_email
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.basename(__file__))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    logger.info('handler')
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        origin = parser.parse_header()
        response_generator.origin_domain = origin
        candidate_id = parser.parse_request_parameter('id')

        # business logic
        candidate = Candidate()
        candidate.id = candidate_id

        with postgres_client as db_client:
            candidate_repo = CandidateRepository(db_client)
            interview_repo = InterviewRepository(db_client)
            candidate = candidate_repo.retrieve_by_id(candidate.id)
            interview = interview_repo.retrieve_by_candidate_id(candidate.id)

        send_email(candidate_email=candidate.email, interview_id=interview.id)

        return response_generator.generate_success_response(origin)
    except Exception as e:
        logger.error(e)
        return response_generator.generate_error_response(400, str(e))
