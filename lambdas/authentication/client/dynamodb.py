import boto3

from config import Config


class DynamoDBClient:
    def __init__(self, table_name):
        dynamodb = boto3.resource('dynamodb')
        self.client = dynamodb.Table(f'{Config.ENVIRONMENT}-{table_name}')

    def insert(self, **kwargs):
        self.client.put_item(Item=kwargs)
