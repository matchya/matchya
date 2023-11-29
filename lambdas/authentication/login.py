import json
import logging

import psycopg2
import boto3
from boto3.dynamodb.types import Binary

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.password import check_password
from utils.token import generate_access_token

# Logger
logger = logging.getLogger('login')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

# DynamoDB
dynamodb = boto3.resource('dynamodb')
access_token_table = dynamodb.Table(f'{Config.ENVIRONMENT}-AccessToken')

# Postgres
db_conn = None
db_cursor = None


def connect_to_db():
    """
    Reconnects to the database.
    """
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


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


def parse_header(event):
    """
    Parses the request header from an event and extracts the origin and host to resolve cors issue

    :param event: The event object containing the request data.
    :return: origin and the host
    """
    try:
        headers = event['headers']
        origin = headers.get('origin')
        host = headers.get('Host')
        if not origin:
            raise ValueError('Origin not included in headers')
        if not host:
            raise ValueError('Host not included in headers')
        return origin, host
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def get_company_info(email):
    """
    Retrieves company information from the database based on the provided email.

    :param email: The email address used to query the company information.
    :return: The first item from the database query result.
    """
    try:
        db_cursor.execute('SELECT * FROM company WHERE email = %s', (email,))
        result = db_cursor.fetchall()
    except Exception as e:
        raise RuntimeError(f"Error retrieving company info: {e}")
    if not result:
        raise ValueError('Company not found')

    company_res = result[0]
    company_info = {
        'id': company_res[0],
        'name': company_res[1],
        'email': company_res[2],
        'github_username': company_res[3],
        'password': company_res[4]
    }
    return company_info


def validate_password(password, stored_password):
    """
    Validates a password against its stored (hashed) counterpart.

    :param password: The plaintext password to validate.
    :param stored_password: The stored (hashed) password for comparison.
    """
    if isinstance(stored_password, Binary):
        stored_password = stored_password.value
    if isinstance(stored_password, memoryview):
        stored_password = stored_password.tobytes()
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
        logger.info('Received login request')
        connect_to_db()

        body = parse_request_body(event)
        origin, host = parse_header(event)
        email = body.get('email')
        password = body.get('password')

        company = get_company_info(email)
        validate_password(password, company['password'])
        access_token = generate_access_token(company['id'])

        logger.info('Login successful: %s', email)
        return generate_success_response(origin, host, access_token)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Login failed (status {str(status_code)}): {e}')
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Login failed (status {str(status_code)}): {e}')
        return generate_error_response(origin, status_code, str(e))
    finally:
        db_conn.close()
