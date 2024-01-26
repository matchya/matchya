import os
import uuid

from client.postgres import PostgresDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class QuestionRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert_many(self, questions: list) -> str:
        logger.info(f"insert_many: {questions}")
        sql = "INSERT INTO question (id, text, difficulty, topic) VALUES"
        try:
            for question in questions:
                id = str(uuid.uuid4())
                text = question['text'].replace("'", "''")
                topic = question['topic'].replace("'", "''")
                question['id'] = id
                sql += f" ('{id}', '{text}', '{question['difficulty']}', '{topic}'),"
            sql = sql[:-1] + ';'
            self.db_client.execute(sql)

        except Exception as e:
            logger.error(f"Error saving questions to question table: {e}")
            raise RuntimeError("Error saving questions to question table")
