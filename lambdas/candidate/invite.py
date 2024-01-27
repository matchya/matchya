import os
import time
import uuid

from client.dynamodb import DynamodbClient
from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from client.ses import SESClient
from config import Config
from entity.candidate import Candidate
from repo.candidate import CandidateRepository
from repo.interview import InterviewRepository
from repo.interview_access_token import InterviewAccessTokenRepository
from utils.email_content_creator import CandidateInviteEmailContentGenerator
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
dynamodb_client = DynamodbClient()
ses_client = SESClient()
response_generator = ResponseGenerator()
interview_access_token_repo = InterviewAccessTokenRepository(dynamodb_client)


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

        # check if the token already exists and is not expired
        if interview_access_token_repo.retrieve_by_candidate_id(candidate_id=candidate.id, interview_id=interview.id):
            raise Exception('Candidate already invited')
        # save the interview access token
        token = str(uuid.uuid4())
        interview_access_token_repo.insert(token=token, candidate_id=candidate.id, interview_id=interview.id, expiry_time=int(time.time()) + 3600, status='Active')
        # send the invitation email
        body_html_content, body_text_content = CandidateInviteEmailContentGenerator.generate(interview_id=interview.id, 
                                                                                             interview_access_token=token)
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
