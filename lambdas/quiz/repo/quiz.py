import os
from typing import List
import uuid

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
        
    def insert(self, context, topic, subtopic, difficulty, description, is_original=False, additional_criteria='', max_score=1):
        """
        Inserts a quiz into the database.

        :param context: The context.
        :param topic: The topic.
        :param subtopic: The subtopic.
        :param difficulty: The difficulty.
        :param description: The description.
        :param is_original: Whether the quiz is original.
        """
        logger.info('Inserting a quiz into db...')
        id = uuid.uuid4()
        sql = """
            INSERT INTO quiz (id, context, topic, subtopic, difficulty, description, is_original, addtional_criteria, max_score)
            VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        """ % (id, context, topic, subtopic, difficulty, description, is_original, additional_criteria, max_score)
        try:
            self.db_client.execute(sql)
            logger.info('Successfully inserted a quiz into db')
        except Exception as e:
            logger.error(f'Failed to insert a quiz into db: {e}')
            raise RuntimeError('Failed to insert a quiz into db.')

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

    def retrieve_by_id(self, quiz_id):
        """
        Gets a quiz by quiz id from the database.

        :param quiz_id: The quiz id.
        """
        logger.info('Getting a quiz by quiz id from db...')
        sql = """
            SELECT 
                quiz.id, quiz.context, quiz.topic, quiz.subtopic, quiz.difficulty,
                question.id, question.text, question.criteria
            FROM quiz
            LEFT JOIN question ON quiz.id = question.quiz_id
            WHERE quiz.id = '%s'
        """ % quiz_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            quiz = self._process_sql_result(result)
            return quiz
        except Exception as e:
            logger.error(f'Failed to get a quiz by quiz id from db: {e}')
            raise RuntimeError('Failed to get a quiz by quiz id from db.')

    def _process_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        """
        if not result:
            raise ValueError('Quiz not found.')
        quiz = {
            'id': result[0][0],
            'context': result[0][1],
            'topic': result[0][2],
            'subtopic': result[0][3],
            'difficulty': result[0][4],
            'questions': []
        }
        for row in result:
            (question_id, question_text, question_criteria) = row[5:]

            question = {
                'id': question_id,
                'text': question_text,
                'criteria': question_criteria
            }
            quiz['questions'].append(question)
        return quiz
