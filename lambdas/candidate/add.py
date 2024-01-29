import os

from client.dynamodb import DynamoDBClient
from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from client.ses import SESClient
from config import Config
from entity.candidate import Candidate
from entity.interview import Interview
from repo.assessment_candidate import AssessmentCandidateRepository
from repo.candidate import CandidateRepository
from repo.interview import InterviewRepository
from repo.interview_access_token import InterviewAccessTokenRepository
from utils.email_content_creator import CandidateInviteEmailContentGenerator
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator
from utils.token import retrieve_interview_access_token

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
dynamodb_client = DynamoDBClient(table_name='InterviewAccessToken')
ses_client = SESClient()
response_generator = ResponseGenerator()
interview_access_token_repo = InterviewAccessTokenRepository(dynamodb_client)


def handler(event, context):
    """
    This lambda is responsible when the user fills in their candidate's name and email and clicks on the 'Send Invitation' button.
    """
    logger.info('Starting lambda execution')
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        body = parser.parse_request_body()
        origin = parser.parse_header()
        response_generator.origin = origin

        # business logic
        candidate = Candidate()
        candidate.name = body.get('name')
        candidate.email = body.get('email')
        interview = Interview(body.get('assessment_id'))

        with postgres_client as db_client:
            candidate_repo = CandidateRepository(db_client)
            assessment_candidate_repo = AssessmentCandidateRepository(db_client)
            interview_repo = InterviewRepository(db_client)

            # we want to make sure we haven't already sent an invitation to this candidate
            # it should be visually clear because the candidate will be in the list of candidates
            # however, if the user ever did send an invitation to this candidate, we want to return an error message
            if not candidate_repo.check_exists_by_email(email=candidate.email):
                candidate.id = candidate_repo.insert(name=candidate.name, email=candidate.email)
            else:
                # the candidate may already be registered via other assessments
                candidate.id = candidate_repo.retrieve_by_email(email=candidate.email)
            # is the candidate already added to the assessment?
            if assessment_candidate_repo.check_exists(assessment_id=interview.assessment_id, candidate_id=candidate.id):
                raise RuntimeError('Candidate is already added to the assessment')
            # we want to avoid having duplicate candidates in the invitation list
            assessment_candidate_repo.insert(assessment_id=interview.assessment_id, candidate_id=candidate.id)
            interview.id = interview_repo.insert(assessment_id=interview.assessment_id, candidate_id=candidate.id)
            token = retrieve_interview_access_token(interview_access_token_repo, candidate.id, interview.id)
            body_html_content, body_text_content = CandidateInviteEmailContentGenerator.generate(interview_id=interview.id, 
                                                                                                 interview_access_token=token)
            email_id = ses_client.send_email(sender=Config.SENDER_EMAIL_ADDRESS, destinations=[candidate.email],
                                             body_html_content=body_html_content,
                                             body_text_content=body_text_content,
                                             subject="You received an invitation to the assessment from Matchya")
            db_client.commit()

        return response_generator.generate_success_response({
            'email_id': email_id
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Adding a new candidate failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Adding a new candidate failed: {e}')
        return response_generator.generate_error_response(500, str(e))
