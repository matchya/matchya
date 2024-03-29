import os
from typing import List
# import uuid

from client.postgres import PostgresDBClient
from entity.quiz import Quiz
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuizRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def retrieve_many_by_ids(self, quiz_ids: list) -> List[Quiz]:
        logger.info('Retrieving quizzes by ids')
        sql = """
            SELECT id, difficulty, topic, subtopic, description, is_original, created_at 
            FROM quiz WHERE id IN ('{quiz_ids}')
        """.format(quiz_ids="', '".join(quiz_ids))
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            return [Quiz(id=row[0], difficulty=row[1], topic=row[2], subtopic=row[3], description=row[4], is_original=row[5], created_at=row[6]) for row in result]
        except Exception as e:
            logger.error(f"Error retrieving quizzes from quiz table: {e}")
            raise RuntimeError("Error retrieving quizzes from quiz table")
