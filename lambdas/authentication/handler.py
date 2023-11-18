import json
import datetime
import os
import uuid

import boto3

environment = os.environ.get('ENVIRONMENT')

dynamodb = boto3.resource('dynamodb')
company_table = dynamodb.Table(f'{environment}-Company')
access_token_table = dynamodb.Table(f'{environment}-AccessToken')


def register(event, context):
    # Parse the JSON body from the event
    try:
        body = event.get('body', '')
        if not body:
            raise json.JSONDecodeError
        body = json.loads(event.get('body', ''))
    except json.JSONDecodeError:
        return {'statusCode': 400, 'body': 'Invalid JSON in request body'}

    # Validate that required fields are present
    email = body.get('email')
    company_name = body.get('company_name')
    github_account_url = body.get('github_account_url')
    password = body.get('password')

    if not all([email, company_name, github_account_url, password]):
        return {'statusCode': 400, 'body': 'Missing required fields'}

    body = json.loads(event['body'])

    created_at = str(datetime.datetime.now())

    # Generate a unique companyId
    company_id = str(uuid.uuid4())

    company_info = {
        'company_id': company_id,
        'company_name': company_name,
        'email': email,
        'github_account_url': github_account_url,
        'password': event.get('password')  # Ensure this is securely hashed
    }

    try:
        company_table.put_item(Item=company_info)
    except Exception:
        return {'statusCode': 400, 'body': 'Something went wrong while saving to db'}

    access_token = _generate_access_token(company_id)

    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': created_at
        }
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response


def _generate_access_token(company_id):
    return f'{company_id}_access_token'
