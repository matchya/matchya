import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from entity.candidate import Candidate
from entity.interview import Interview
from repo.assessment_candidate import AssessmentCandidateRepository
from repo.candidate import CandidateRepository
from repo.interview import InterviewRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator
from utils.email import send_email

logger = Logger.configure(os.path.basename(__file__))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    try:
        logger.info(handler)

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

            if not candidate_repo.check_exists_by_email(body['email']):
                candidate.id = candidate_repo.insert(body)
            else:
                candidate.id = candidate_repo.retrieve_by_email(body['email'])

            assessment_candidate_repo.insert(assessment_id=interview.assessment_id, candidate_id=candidate.id)
            interview.id = interview_repo.insert(interview.assessment_id, candidate_id=candidate.id)
            send_email(candidate_email=candidate.email, interview_id=interview.id)
            db_client.commit()

        return response_generator.generate_success_response({
            'candidate_id': candidate.id
        })
    except (ValueError, RuntimeError) as e:
        logger.error(f'Adding a new candidate failed: {e}')
        return response_generator.generate_error_response(400, str(e))
    except Exception as e:
        logger.error(f'Adding a new candidate failed: {e}')
        return response_generator.generate_error_response(500, str(e))
