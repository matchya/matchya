import json

import boto3
from boto3.dynamodb.types import Binary

from config import Config
from utils.response import generate_success_response
from utils.password import check_password
from utils.token import generate_access_token

dynamodb = boto3.resource('dynamodb')

access_token_table = dynamodb.Table(f'{Config.ENVIRONMENT}-AccessToken')
company_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Company')


def parse_request_body(event):
    """
    Parses the request body from an event and returns it as a JSON object.

    :param event: The event object containing the request data.
    :return: Parsed JSON object from the request body.
    """
    try:
        body = event.get('body', '')
        if not body:
            raise ValueError("Empty body")
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def get_company_info(email):
    """
    Retrieves company information from the database based on the provided email.

    :param email: The email address used to query the company information.
    :return: The first item from the database query result.
    """
    response = company_table.query(
        IndexName='EmailIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )
    if not response['Items']:
        raise ValueError('Email is invalid')
    return response['Items'][0]


def validate_password(password, stored_password):
    """
    Validates a password against its stored (hashed) counterpart.

    :param password: The plaintext password to validate.
    :param stored_password: The stored (hashed) password for comparison.
    """
    if isinstance(stored_password, Binary):
        stored_password = stored_password.value
    if not check_password(password, stored_password):
        raise ValueError('Password is invalid')


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
        access_token = generate_access_token(company['company_id'])
        return generate_success_response(access_token)
    except ValueError as e:
        return {'statusCode': 400, 'body': str(e)}
