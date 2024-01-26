import os
from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class AssessmentQuestionRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def insert(self, assessment_id: str, questions: list) -> str:
        """
        Saves the questions to the assessment_question table.

        :param assessment_id: Unique identifier for the assessment.
        :param questions: The questions to save.
        """
        logger.info(f"insert: {assessment_id}, {questions}")
        sql = "INSERT INTO assessment_question (assessment_id, question_id) VALUES "
        try:
            for question in questions:
                sql += f" ('{assessment_id}', '{question['id']}'),"
            sql = sql[:-1] + ';'
            self.db_client.execute(sql)
        except Exception as e:
            logger.error(f"Error saving questions to assessment_question table: {e}")
            raise RuntimeError("Error saving questions to assessment_question table")
