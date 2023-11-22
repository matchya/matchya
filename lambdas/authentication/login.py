import json
import datetime

import boto3
from boto3.dynamodb.types import Binary

from config import Config
from utils.password import check_password
from utils.token import generate_access_token

dynamodb = boto3.resource('dynamodb')

access_token_table = dynamodb.Table(f'{Config.environment}-AccessToken')
company_table = dynamodb.Table(f'{Config.environment}-Company')


def parse_request_body(event):
    try:
        body = event.get('body', '')
        if not body:
            raise ValueError("Empty body")
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def get_company_info(email):
    response = company_table.query(
        IndexName='EmailIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )
    if not response['Items']:
        raise ValueError('Email is invalid')
    return response['Items'][0]


def validate_password(password, stored_password):
    if isinstance(stored_password, Binary):
        stored_password = stored_password.value
    if not check_password(password, stored_password):
        raise ValueError('Password is invalid')


def generate_login_response(company_id):
    access_token = generate_access_token(company_id)
    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': str(datetime.datetime.now())
        }
    }
    return {"statusCode": 200, "body": json.dumps(body)}


def handler(event, context):
    """
    Handles user login by validating credentials and generating an access token.

    :param event: The event dictionary containing the HTTP request data.
    :param context: The context object providing runtime information.
    :return: A dictionary with a status code and the body of the response.
             The response body contains an access token and creation timestamp
             in case of a successful login, or an error message in case of failure.
    """
    try:
        body = parse_request_body(event)
        email = body.get('email')
        password = body.get('password')

        company = get_company_info(email)
        validate_password(password, company['password'])

        return generate_login_response(company['company_id'])
    except ValueError as e:
        return {'statusCode': 400, 'body': str(e)}
