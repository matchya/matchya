
import os

from client.dynamodb import DynamodbClient
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class InterviewAccessTokenRepository:
    def __init__(self, db_client: DynamodbClient):
        self.db_client = db_client

    def retrieve_by_token(self, token):
        """
        Retrieves the interview access token from the database.
        """
        logger.info(f'Retrieving interview access token from database: {token}')
        result = self.db_client.get_item(Key={'token': token})
        logger.info(f'Result: {result}')
        return result.get('Item', {})

    def update_status(self, token, status):
        """
        Updates the status of the interview access token in the database.
        """
        logger.info(f'Updating interview access token status in database: {status}')
        result = self.db_client.update_item(Key={'token': token}, AttributeUpdates={'status': status})
        logger.info(f'Result: {result}')
        return result.get('Item', {})
