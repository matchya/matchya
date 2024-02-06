import os
import uuid

from client.postgres import PostgresDBClient
from entity.interview import Interview
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class InterviewRepository:
    """
    This class is responsible for all the database operations
    """

    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert(self, assessment_id: str, candidate_id: str) -> str:
        """
        Creates a new interview record.

        :param assessment_id: The id of the assessment.
        :param candidate_id: The id of the candidate.
        :return: The id of the newly created interview record.
        """
        # TODO: generate quetions for the interview... not in the MVP
        logger.info(f'Inserting to interview table: {assessment_id}, {candidate_id}')
        sql = "INSERT INTO interview (id, assessment_id, candidate_id) VALUES (%s, %s, %s);"
        try:
            interview_id = str(uuid.uuid4())
            self.db_client.execute(sql, (interview_id, assessment_id, candidate_id))
            logger.info('Successfully inserted to interview table')
            return interview_id
        except Exception as e:
            raise RuntimeError(f"Error saving to interview table: {e}")

    def retrieve_by_candidate_id(self, candidate_id: str) -> Interview:
        """
        Retrieves the interview id.
        """
        logger.info(f'Retrieving interview by candidate id: {candidate_id}')
        sql = """
            SELECT id, candidate_id, assessment_id
            FROM interview
            WHERE interview.candidate_id = '%s';
        """ % candidate_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchone()
            interview = Interview(assessment_id=result[1])
            interview.id = result[0]
            interview.candidate_id = result[1]
            interview.assessment_id = result[2]
            logger.info('Successfully retrieved interview')
            return interview
        except Exception as e:
            logger.error(e)
            raise Exception('Interview not found')

    def retrieve_company_name_by_id(self, assessment_id: str) -> str:
        """
        Retrieves the company name by the assessment id.
        """
        logger.info(f'Retrieving company name by assessment id: {assessment_id}')
        sql = """
            SELECT company.name
            FROM company
            LEFT JOIN assessment ON company.id = assessment.company_id
            WHERE assessment.id = '%s';
        """ % assessment_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchone()
            return result[0]
        except Exception as e:
            logger.error(e)
            raise Exception('Company name not found')
