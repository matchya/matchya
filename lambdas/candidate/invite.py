import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from client.ses import SESClient
from config import Config
from entity.candidate import Candidate
from repo.candidate import CandidateRepository
from repo.interview import InterviewRepository
from utils.email_content_creator import CandidateInviteEmailContentGenerator
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
ses_client = SESClient()
response_generator = ResponseGenerator()
email_content_generator = CandidateInviteEmailContentGenerator()


def handler(event, context):
    logger.info('Starting lambda execution')
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

        body_html_content, body_text_content = email_content_generator.generate(interview.id)
        email_id = ses_client.send_email(sender=Config.SENDER_EMAIL_ADDRESS, destinations=[candidate.email],
                                         body_html_content=body_html_content,
                                         body_text_content=body_text_content,
                                         subject="You received an invitation to the assessment from Matchya")

        return response_generator.generate_success_response({
            'email_id': email_id
        })
    except Exception as e:
        logger.error(e)
        return response_generator.generate_error_response(400, str(e))
