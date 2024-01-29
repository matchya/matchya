import os
from typing import List
import uuid

from client.postgres import PostgresDBClient
from entity.question import Question
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuestionRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert_many(self, questions: list) -> None:
        logger.info(f'Inserting questions: {questions}')
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

    def retrieve_many_by_assessment_id(self, assessment_id: str) -> List[Question]:
        logger.info(f'Retrieving questions by assessment_id: {assessment_id}')
        sql = f"SELECT * FROM question WHERE id IN (SELECT question_id FROM assessment_question WHERE assessment_id = '{assessment_id}')"
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            return [Question(text=row[1], difficulty=row[2], topic=row[3], id=row[0], created_at=row[4]) for row in result]
        except Exception as e:
            logger.error(f"Error retrieving questions from question table: {e}")
            raise RuntimeError("Error retrieving questions from question table")
