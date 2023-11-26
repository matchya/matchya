import json
import uuid
import logging
import requests

import boto3
import psycopg2

from config import Config
from utils.password import hash_password
from utils.response import generate_error_response, generate_success_response
from utils.token import generate_access_token

# Logger
logger = logging.getLogger('register')
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


def validate_company_data(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    required_fields = ['email', 'name', 'github_username', 'password']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields')


def create_company_record(company_id: str, body: dict):
    """
    Creates a new company record in the database.

    :param company_id: Unique identifier for the company.
    :param body: The request body containing company data.
    """
    sql = "INSERT INTO company (id, name, email, github_username, password) VALUES (%s, %s, %s, %s, %s);"
    try:
        db_cursor.execute(sql, (company_id, body['name'], body['email'], body['github_username'], hash_password(body['password'])))
    except Exception as e:
        raise RuntimeError(f"Error saving to company table: {e}")
    

def save_company_repositories(company_id: str, github_username: str):
    """
    Saves the repositories of the company to the database.

    :param company_id: Unique identifier for the company.
    :param github_username: The GitHub username of the company.
    """
    repositories = get_company_repository_names(github_username)
    sql = "INSERT INTO company_repository (id, company_id, repository_name) VALUES"
    for repository in repositories:
        sql += f" ('{str(uuid.uuid4())}', '{company_id}', '{repository}'),"
    sql = sql[:-1] + ';'
    try:
        db_cursor.execute(sql)
    except Exception as e:
        raise RuntimeError(f"Error saving to repository table: {e}")
    

def get_company_repository_names(github_username: str):
    """
    Gets the repositories of a company from GitHub.

    :param company_id: The GitHub username of the company.
    :return: A list of repositories of the company.
    """
    url = f"https://api.github.com/users/{github_username}/repos"
    response = requests.get(url)
    if response.status_code == 404:
        raise RuntimeError(f"GitHub account not found: {github_username}")
    if response.status_code != 200:
        raise RuntimeError(f"Error getting repositories from GitHub account: {github_username}")
    repositories = response.json()
    repo_names = [repository['name'] for repository in repositories]
    return repo_names


def create_position_record(company_id, position_name='Software Engineer'):
    """
    Creates a new position record in the database.

    :param position_id: Unique identifier for the position.
    :param company_id: Unique identifier for the company.
    """
    sql = "INSERT INTO position (id, company_id, name) VALUES (%s, %s, %s);"
    try:
        position_id = str(uuid.uuid4())
        db_cursor.execute(sql, (position_id, company_id, position_name))
    except Exception as e:
        raise RuntimeError(f"Error saving to position table: {e}")


def create_access_token_record(company_id, access_token):
    """
    Creates a new access token record in the database.

    :param company_id: Unique identifier for the company associated with the token.
    :param access_token: The access token to be saved.
    """
    access_token_info = {
        'token_id': access_token,
        'company_id': company_id
    }
    try:
        access_token_table.put_item(Item=access_token_info)
    except Exception as e:
        raise RuntimeError(f"Error saving to access token table: {e}")


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
        logger.info('Received register request')
        connect_to_db()
        body = parse_request_body(event)
        validate_company_data(body)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, body)

        create_position_record(company_id)
        save_company_repositories(company_id, body['github_username'])

        access_token = generate_access_token(company_id)
        create_access_token_record(company_id, access_token)

        db_conn.commit()
        logger.info('Registration successful: %s', body['email'])
        return generate_success_response(access_token)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Registration failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Registration failed (status {str(status_code)}): {e}')
        return generate_error_response(status_code, str(e))
    finally:
        db_conn.close()
