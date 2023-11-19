import json
import boto3
import os
from os.path import join, dirname

from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

environment = os.environ.get('ENVIRONMENT')
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')


def retrieve_criteria(event, context):
    parameter = event.get('pathParameters')
    if parameter is None:
        return {'statusCode': 400, 'body': 'Missing required parameters'}
    criteria_id = parameter.get('id')
    
    if criteria_id is None:
        return {'statusCode': 400, 'body': 'Criteria id is required'}

    criteria = None
    try:
        response = dynamodb_client.get_item(
            TableName=f'{environment}-Criteria',
            Key={'criteria_id': {'S': criteria_id}},
        )
        if 'Item' not in response:
            return {'statusCode': 400, 'body': 'Criteria does not exist'}
        criteria = response['Item']['tech_stack']
    except Exception:
        return {'statusCode': 400, 'body': 'Something went wrong while getting company github url'}

    if criteria is None:
        return {'statusCode': 400, 'body': 'Something went wrong while getting company github url'}
    
    criteria = criteria['SS']
    body = {
        "criteria": criteria,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
