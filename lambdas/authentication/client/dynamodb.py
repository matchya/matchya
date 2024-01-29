import boto3

from config import Config


class DynamoDBClient:
    def __init__(self, table_name):
        dynamodb = boto3.resource('dynamodb')
        self.client = dynamodb.Table(f'{Config.ENVIRONMENT}-{table_name}')

    def insert(self, **kwargs):
        self.client.put_item(Item=kwargs)

    def retrieve(self, key):
        """
        Retrieves an item from the database.
        """
        response = self.client.get_item(Key=key)
        return response.get('Item', {})

    def query(self, index_name, key_condition_expression):
        """
        Queries the database.
        """
        response = self.client.query(
            IndexName=index_name,
            KeyConditionExpression=key_condition_expression
        )
        return response['Items']

    def update_status(self, key, new_value):
        self.client.update_item(
            Key=key,
            UpdateExpression='SET #status = :v',
            ExpressionAttributeValues={':v': new_value},
            ExpressionAttributeNames={
                '#status': 'status'
            },
        )
