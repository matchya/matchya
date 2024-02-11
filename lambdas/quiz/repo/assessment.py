
import os
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class AssessmentRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def get_position_type_and_level(self, interview_id):
        """
        Gets the position type and level by interview id from the database.

        :param interview_id: The interview id.
        """
        logger.info('Getting the position type and level by interview id from db...')
        sql = """
            SELECT 
                assessment.position_type, assessment.position_level
            FROM assessment
            LEFT JOIN interview ON assessment.id = interview.assessment_id
            WHERE interview.id = '%s'
        """ % interview_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchone()
            if result:
                return result[0], result[1]
            else:
                raise ValueError('Interview id does not exist.')
        except Exception as e:
            logger.error(f'Failed to get the position type and level by interview id from db: {e}')
            raise RuntimeError('Failed to get the position type and level by interview id from db.')
