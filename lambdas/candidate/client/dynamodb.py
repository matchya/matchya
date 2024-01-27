import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class DynamodbClient:
    def __init__(self, table_name):
        dynamodb = boto3.resource('dynamodb')
        self.table = dynamodb.Table(f'{Config.ENVIRONMENT}-{table_name}')
        logger.info(f'DynamodbClient initialized with table: {self.table}')

    def retrieve(self, key):
        """
        Retrieves an item from the database.
        """
        self.table.get_item(Key=key)

    def insert(self, **kwargs):
        """
        Inserts an item to the database.
        """
        try:
            # Validate kwargs here if necessary
            self.table.put_item(Item=kwargs)
        except (BotoCoreError, ClientError) as e:
            # Log the error and re-raise
            logger.error(f"Failed to insert item: {e}")
            raise

    def query(self, index_name, key_condition_expression):
        """
        Queries the database.
        """
        try:
            response = self.table.query(
                IndexName=index_name,
                KeyConditionExpression=key_condition_expression
            )
            return response['Items']
        except (BotoCoreError, ClientError) as e:
            # Log the error and re-raise
            logger.error(f"Failed to query item: {e}")
            raise
