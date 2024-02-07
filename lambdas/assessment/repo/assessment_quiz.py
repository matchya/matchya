import os
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class AssessmentQuizRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def insert(self, assessment_id: str, quiz_ids: list) -> str:
        """
        Saves the quizes to the assessment_quiz table.

        :param assessment_id: Unique identifier for the assessment.
        :param quizes: The quizes to save.
        """
        if len(quiz_ids) == 0:
            return
        logger.info(f"insert: {assessment_id}, {quiz_ids}")
        sql = "INSERT INTO assessment_quiz (assessment_id, quiz_id) VALUES "
        try:
            for quiz_id in quiz_ids:
                sql += f" ('{assessment_id}', '{quiz_id}'),"
            sql = sql[:-1] + ';'
            self.db_client.execute(sql)
        except Exception as e:
            logger.error(f"Error saving quizes to assessment_quiz table: {e}")
            raise RuntimeError("Error saving quizes to assessment_quiz table")
