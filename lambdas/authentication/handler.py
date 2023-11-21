import json
import datetime
import os
import uuid

import bcrypt
import boto3
from boto3.dynamodb.types import Binary

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
        return _generate_response(status_code=400, body='Missing required fields')

    body = json.loads(event['body'])

    # Generate a unique companyId
    company_id = str(uuid.uuid4())

    company_info = {
        'company_id': company_id,
        'company_name': company_name,
        'email': email,
        'github_account_url': github_account_url,
        'password': _hash_password(password)  # Ensure this is securely hashed
    }
    try:
        company_table.put_item(Item=company_info)
    except Exception:
        return _generate_response(status_code=400, body='Something went wrong while saving to company table')

    access_token = _generate_access_token(company_id)

    access_token_info = {
        'token_id': access_token,
        'company_id': company_id
    }
    try:
        access_token_table.put_item(Item=access_token_info)
    except Exception:
        return _generate_response(status_code=400, body='Something weng wrong while saving to access token table')

    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': str(datetime.datetime.now())
        }
    }

    return _generate_response(status_code=200, body=json.dumps(body))


def login(event, context):
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
    password = body.get('password')

    # retrieve the company info by email
    response = company_table.query(
        IndexName='EmailIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )
    company_info = response['Items']

    # Assuming there is only one company per email
    if not company_info:
        return {'statusCode': 400, 'body': 'Email is invalid'}

    company = company_info[0]
    company_id = company['company_id']

    if isinstance(company['password'], Binary):
        retrieved_password = company['password'].value
    else:
        retrieved_password = company['password']
    # compare password
    if not _check_password(password, retrieved_password):
        return {'statusCode': 400, 'body': 'Password is invalid'}

    # generate access token
    access_token = _generate_access_token(company_id)

    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': str(datetime.datetime.now())
        }
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response


def _generate_access_token(company_id):
    return f'{company_id}_access_token'


def _hash_password(password):
    # Convert the password to bytes
    password_bytes = password.encode('utf-8')
    # Generate a salt
    salt = bcrypt.gensalt()

    # Check if salt is generated
    if salt is None:
        raise ValueError("Failed to generate salt")

    # Generate the hashed password
    hashed_password = bcrypt.hashpw(password_bytes, salt)

    return hashed_password


def _check_password(plain_password, hashed_password):
    # Convert the plain password to bytes
    password_bytes = plain_password.encode('utf-8')
    # Check if the password matches the hash
    return bcrypt.checkpw(password_bytes, hashed_password)


def _generate_response(status_code, body):
    return {"statusCode": status_code, "body": body, 'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': True,
    }}
