import logging
import uuid
import requests
import json

import boto3
import psycopg2

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body
from utils.token import generate_access_token

# Logger
logger = logging.getLogger('google authentication')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False


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
    logger.info('Connecting to db...')
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def validate_request_body(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    logger.info("Validating the company data...")
    required_fields = ['token']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields.')


def get_user_details(access_token):
    """
    Gets the GitHub username and email address of the user.

    :param gh_access_token: The GitHub access token.
    :return: The GitHub username and email address of the user.
    """
    try:
        logger.info("Getting the Google username and email address...")
        res = requests.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token)
        data = json.loads(res.content)
        return data['name'], data['email']
    except Exception as e:
        raise RuntimeError(f"Error getting GitHub user details: {e}")


def company_already_exists(email):
    """
    Checks if the company already exists in the database.

    :param email: The email address of the user.
    :return: True if the user already exists, False otherwise.
    """
    logger.info(f"Checking if the user already exists... {email}")
    sql = "SELECT id FROM company WHERE email = %s;"
    try:
        db_cursor.execute(sql, (email,))
        return db_cursor.fetchone() is not None
    except Exception as e:
        raise RuntimeError(f"Error checking if user already exists: {e}")


def get_company_id(email):
    """
    Retrieves the company id from the database based on the provided email.

    :param email: The email address used to query the company id.
    :return: The first item from the database query result.
    """
    logger.info("Getting company id...")
    try:
        db_cursor.execute('SELECT id FROM company WHERE email = %s', (email,))
        result = db_cursor.fetchall()
    except Exception as e:
        raise RuntimeError(f"Error retrieving company id: {e}")
    if not result:
        raise ValueError('Company not found. Please try again.')

    return result[0][0]


def create_company_record(company_id: str, body: dict):
    """
    Creates a new company record in the database.

    :param company_id: Unique identifier for the company.
    :param body: The request body containing company data.
    """
    logger.info("Creating the company record...")
    sql = "INSERT INTO company (id, name, email) VALUES (%s, %s, %s);"
    try:
        db_cursor.execute(sql, (company_id, body['name'], body['email']))
    except psycopg2.IntegrityError:
        raise RuntimeError(f"Email address is already used: {body['email']}")
    except Exception as e:
        raise RuntimeError(f"Error saving to company table: {e}")


def create_default_position(company_id) -> str:
    """
    Creates a new position record in the database.

    :param body: The request body containing the position data.
    :return: The id of the newly created position record.
    """
    logger.info("Creating a position record...")
    name = 'Software Engineer'
    level = 'mid'
    type = 'fullstack'
    sql = "INSERT INTO position (id, company_id, name, type, level) VALUES (%s, %s, %s, %s, %s);"
    try:
        position_id = str(uuid.uuid4())
        db_cursor.execute(sql, (position_id, company_id, name, type, level))
        return position_id
    except Exception as e:
        raise RuntimeError(f"Error saving to position table: {e}")


def create_access_token_record(company_id, access_token):
    """
    Creates a new access token record in the database.

    :param company_id: Unique identifier for the company associated with the token.
    :param access_token: The access token to be saved.
    """
    logger.info("Creating an access token record...")
    access_token_info = {
        'token_id': access_token,
        'company_id': company_id
    }
    try:
        access_token_table.put_item(Item=access_token_info)
    except Exception as e:
        raise RuntimeError(f"Error saving to access token table: {e}")


def handler(event, context):
    try:
        logger.info('Google Authentication started...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin, host = parse_header(event)
        validate_request_body(body)

        token = body.get('token')
        username, email = get_user_details(token)

        data = {
            "name": username,
            "email": email
        }

        if company_already_exists(email):
            company_id = get_company_id(email)
            access_token = generate_access_token(company_id)
            logger.info('Google Login successful: %s', email)
            return generate_success_response(origin, host, access_token)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, data)

        create_default_position(company_id)

        access_token = generate_access_token(company_id)
        create_access_token_record(company_id, access_token)

        db_conn.commit()
        logger.info('Google Registration successful: %s', email)
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
