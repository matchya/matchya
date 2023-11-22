import json
import datetime
import uuid

import boto3

from config import Config
from utils.password import hash_password
from utils.response import generate_response
from utils.token import generate_access_token

dynamodb = boto3.resource('dynamodb')
access_token_table = dynamodb.Table(f'{Config.ENVIRONMENT}-AccessToken')
company_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Company')


def parse_request_body(event):
    try:
        body = event.get('body', '')
        if not body:
            raise ValueError("Empty body")
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def validate_company_data(body):
    required_fields = ['email', 'company_name', 'github_account_url', 'password']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields')


def create_company_record(company_id, body):
    company_info = {
        'company_id': company_id,
        'company_name': body['company_name'],
        'email': body['email'],
        'github_account_url': body['github_account_url'],
        'password': hash_password(body['password'])  # Securely hashed
    }
    try:
        company_table.put_item(Item=company_info)
    except Exception as e:
        raise RuntimeError(f"Error saving to company table: {e}")


def create_access_token_record(company_id, access_token):
    access_token_info = {
        'token_id': access_token,
        'company_id': company_id
    }
    try:
        access_token_table.put_item(Item=access_token_info)
    except Exception as e:
        raise RuntimeError(f"Error saving to access token table: {e}")


def generate_success_response(access_token):
    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': str(datetime.datetime.now())
        }
    }
    return generate_response(status_code=200, body=json.dumps(body))


def handler(event, context):
    """
    Handles the registration of a new company and generates an access token.

    :param event: The event dictionary containing the HTTP request data.
    :param context: The context object providing runtime information.
    :return: A dictionary with a status code and the body of the response.
             The response body contains an access token and creation timestamp
             in case of success, or an error message in case of failure.
    """
    try:
        body = parse_request_body(event)
        validate_company_data(body)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, body)

        access_token = generate_access_token(company_id)
        create_access_token_record(company_id, access_token)

        return generate_success_response(access_token)
    except (ValueError, RuntimeError) as e:
        return generate_response(status_code=400, body=str(e))
