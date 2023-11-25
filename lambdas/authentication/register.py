import json
import uuid

import boto3
import psycopg2

from config import Config
from utils.password import hash_password
from utils.response import generate_response, generate_success_response
from utils.token import generate_access_token

dynamodb = boto3.resource('dynamodb')
access_token_table = dynamodb.Table(f'{Config.ENVIRONMENT}-AccessToken')

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
    sql = "INSERT INTO Company (id, name, email, github_username, password) VALUES (%s, %s, %s, %s, %s);"
    try:
        db_cursor.execute(sql, (company_id, body['name'], body['email'], body['github_username'], hash_password(body['password'])))
    except Exception as e:
        print(e)
        raise RuntimeError(f"Error saving to company table: {e}")
    
    
def create_position_record(position_id, company_id, position_name='Software Engineer'):
    """
    Creates a new position record in the database.

    :param position_id: Unique identifier for the position.
    :param company_id: Unique identifier for the company.
    """
    sql = "INSERT INTO Position (id, company_id, name) VALUES (%s, %s, %s);"
    try:
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
        body = parse_request_body(event)
        validate_company_data(body)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, body)

        position_id = str(uuid.uuid4())
        create_position_record(position_id, company_id)

        access_token = generate_access_token(company_id)
        create_access_token_record(company_id, access_token)

        db_conn.commit()
        return generate_success_response(access_token)
    except (ValueError, RuntimeError) as e:
        return generate_response(status_code=400, body=str(e))
    finally:
        db_conn.close()
