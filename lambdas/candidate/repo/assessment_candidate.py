import os

from client.postgres import PostgresDBClient
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class AssessmentCandidateRepository:
    """
    This class is responsible for all the database operations
    """

    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert(self, assessment_id, candidate_id):
        """
        Register the candidate to assessment.

        :param assessment_id: The id of the assessment.
        :param candidate_id: The id of the candidate.
        """
        logger.info(f'Inserting to assessment_candidate table: {assessment_id}, {candidate_id}')
        sql = "INSERT INTO assessment_candidate (assessment_id, candidate_id) VALUES (%s, %s);"
        try:
            self.db_client.execute(sql, (assessment_id, candidate_id))
            logger.info('Successfully inserted to assessment_candidate table')
        except Exception as e:
            raise RuntimeError(f"Error registering to assessment_candidate table: {e}")

    def check_exists(self, assessment_id, candidate_id):
        """
        Check if the candidate is already registered to the assessment.
        """
        logger.info(f'Checking if candidate is already registered to assessment: {assessment_id}, {candidate_id}')
        sql = "SELECT EXISTS(SELECT 1 FROM assessment_candidate WHERE assessment_id = %s AND candidate_id = %s);"
        try:
            self.db_client.execute(sql, (assessment_id, candidate_id))
            result = self.db_client.fetchone()
            logger.info('Successfully checked if candidate is already registered to assessment')
            return result[0]
        except Exception as e:
            raise RuntimeError(f"Error checking if candidate is already registered to assessment: {e}")
