import os
import uuid

from client.postgres import PostgresDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class MetricRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert_many(self, quizes: list) -> str:
        """
        Saves the questions to the metric table.

        :param position_id: Unique identifier for the position.
        :param questions: The questions to save.
        """
        logger.info(f"insert_many: {quizes}")
        sql = "INSERT INTO metric (id, quiz_id, name, scoring, weight) VALUES "
        try:
            for quiz in quizes:
                for metric in quiz['metrics']:
                    metric_id = str(uuid.uuid4())
                    name = metric['name'].replace("'", "''")
                    scoring = metric['scoring'].replace("'", "''")
                    sql += f" ('{metric_id}', '{quiz['id']}', '{name}', '{scoring[0: 1023]}', {metric['weight']}),"
            sql = sql[:-1] + ';'
            self.db_client.execute(sql)
        except Exception as e:
            logger.error(f"Error saving quizes to metric table: {e}")
            raise RuntimeError("Error saving quizes to metric table")
