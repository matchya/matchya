import os

import boto3

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class DynamoDBClient:
    def __init__(self, table_name):
        dynamodb = boto3.resource('dynamodb')
        self.table = dynamodb.Table(f'{Config.ENVIRONMENT}-{table_name}')
        logger.info(f'DynamoDBClient initialized with table: {self.table}')

    def retrieve(self, key):
        """
        Retrieves an item from the database.
        """
        self.table.get_item(Key=key)
