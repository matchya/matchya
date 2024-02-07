import os
from typing import List

from client.postgres import PostgresDBClient
from entity.quiz import Quiz
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuizRepository:
    """
    This class is responsible for all the database operations
    """

    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def retrieve_many(self) -> List[Quiz]:
        """
        Retrieves quizzes from the database.

        :return: The quizzes.
        """
        logger.info('Retrieving quizzes')
        sql = "SELECT id, description, topic, subtopic, difficulty, created_at FROM quiz LIMIT 10;"
        self.db_client.execute(sql)
        result = self.db_client.fetchall()
        quizzes = []
        for row in result:
            quiz = Quiz()
            quiz.id = row[0]
            quiz.description = row[1]
            quiz.topic = row[2]
            quiz.subtopic = row[3]
            quiz.difficulty = row[4]
            quiz.created_at = str(row[5])
            quizzes.append(quiz)
        logger.info('Successfully retrieved questions')
        return quizzes
