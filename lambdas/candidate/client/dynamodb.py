import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError

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
        response = self.table.get_item(Key=key)
        return response.get('Item', {})

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

    def update(self, key, update_expression, expression_attribute_values):
        """
        Updates an item in the database.
        """
        try:
            self.table.update_item(
                Key=key,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
        except (BotoCoreError, ClientError) as e:
            # Log the error and re-raise
            logger.error(f"Failed to update item: {e}")
            raise
