import os
import psycopg2

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class PostgresDBClient:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(PostgresDBClient, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'db_conn'):
            logger.info('Connecting to DB...')
            self.db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)

    def __enter__(self):
        logger.info('Starting a new transaction...')
        self.db_cursor = self.db_conn.cursor()
        return self

    def __exit__(self, exc_type, *_):
        if exc_type is not None:
            logger.error('An error occurred, rolling back transaction...')
            self.db_conn.rollback()
        else:
            logger.info('Transaction completed successfully, committing...')
            self.db_conn.commit()
        if self.db_cursor:
            self.db_cursor.close()

    def execute(self, sql_statement, params=None):
        self.db_cursor.execute(sql_statement, params)

    def fetchall(self):
        return self.db_cursor.fetchall()

    def fetchone(self):
        return self.db_cursor.fetchone()

    def commit(self):
        self.db_conn.commit()

    def close(self):
        if self.db_conn:
            self.db_conn.close()
