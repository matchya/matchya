import os
import psycopg2

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class PostgresDBClient:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(PostgresDBClient, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'db_conn'):
            logger.info('Initializing DB Connection...')
            self.db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)

    def __enter__(self):
        logger.info('Initializing DB Cursor...')
        self.db_cursor = self.db_conn.cursor()
        return self

    def __exit__(self, *_):
        logger.info('Closing DB Cursor...')
        if self.db_cursor:
            self.db_cursor.close()

    def execute(self, sql_statement, params=None):
        logger.info('execute')
        self.db_cursor.execute(sql_statement, params)

    def fetchall(self):
        logger.info('fetchall')
        return self.db_cursor.fetchall()

    def fetchone(self):
        logger.info('fetchone')
        return self.db_cursor.fetchone()

    def commit(self):
        logger.info('commit')
        self.db_conn.commit()

    def close(self):
        logger.info('close')
        if self.db_conn:
            self.db_conn.close()
