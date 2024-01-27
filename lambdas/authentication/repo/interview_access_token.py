import os
from client.dynamodb import DynamodbClient
from boto3.dynamodb.conditions import Key

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class InterviewAccessTokenRepository:
    def __init__(self, db_client: DynamodbClient):
        self.db_client = db_client

    def retrieve_by_candidate_interview_ids(self, candidate_id, interview_id):
        logger.info(f'Retrieving interview access token for candidate_id: {candidate_id} and interview_id: {interview_id}')
        result = self.db_client.query(index_name='CandidateInterviewIndex',
                                      key_condition_expression=Key('candidate_id').eq(candidate_id) & Key('interview_id').eq(interview_id))
        logger.info('Successfully retrieved interview access token')
        return result['Items']
