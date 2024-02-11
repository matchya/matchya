import os
import uuid

from client.postgres import PostgresDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuestionRepository:
    """
    This class is responsible for all the database operations
    """

    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert_many(self, questions, quiz_id):
        """
        Inserts questions into the database.

        :param questions: The questions.
        :param quiz_id: The quiz id.
        """
        logger.info('Inserting questions into db...')
        if len(questions) == 0:
            raise ValueError('No questions to insert into db.')
        sql = "INSERT INTO question (id, quiz_id, text, criteria) VALUES "
        for question in questions:
            id = str(uuid.uuid4())
            text = question['text'].replace("'", "''")
            criteria = question['criteria'].replace("'", "''")
            sql += "('%s', '%s', '%s', '%s')," % (id, quiz_id, text, criteria)

        sql = sql[:-1]
        try:
            self.db_client.execute(sql)
            logger.info('Successfully inserted questions into db')
        except Exception as e:
            logger.error(f'Failed to insert questions into db: {e}')
            raise RuntimeError('Failed to insert questions into db.')
        