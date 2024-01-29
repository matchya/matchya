import os

from boto3.dynamodb.conditions import Key

from client.dynamodb import DynamoDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class InterviewAccessTokenRepository:
    def __init__(self, db_client: DynamoDBClient):
        self.db_client = db_client

    def insert(self, token, candidate_id, interview_id, expiry_time, status):
        logger.info(f'Inserting interview access token for candidate_id: {candidate_id} and interview_id: {interview_id}')
        self.db_client.insert(token=token, candidate_id=candidate_id, 
                              interview_id=interview_id, expiry_time=expiry_time, status=status)
        logger.info('Successfully inserted interview access token')

    def retrieve_by_candidate_interview_ids(self, candidate_id, interview_id):
        logger.info(f'Retrieving interview access token for candidate_id: {candidate_id} and interview_id: {interview_id}')
        result = self.db_client.query(index_name='CandidateInterviewIndex',
                                      key_condition_expression=Key('candidate_id').eq(candidate_id) & Key('interview_id').eq(interview_id))
        logger.info('Successfully retrieved interview access token')
        return result

    def update(self, token, expiry_time):
        logger.info(f'Updating interview access token: {token}')
        self.db_client.update(key={'token': token},
                              update_expression='SET expiry_time = :expiry_time',
                              expression_attribute_values={':expiry_time': expiry_time})
