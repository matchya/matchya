import logging
import uuid
import requests
import json

import boto3
import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.response import generate_success_response, generate_error_response
from utils.request import parse_header, parse_request_body, validate_request_body
from utils.token import generate_access_token, create_access_token_record
from utils.company import company_already_exists, get_company_id, create_company_record

# Load and parse package.json
with open('package.json') as f:
    package_json = json.load(f)

# Get the version
version = package_json.get('version', 'unknown')

if Config.SENTRY_DSN:
    sentry_sdk.init(
        dsn=Config.SENTRY_DSN,
        environment=Config.ENVIRONMENT,
        integrations=[AwsLambdaIntegration(timeout_warning=True)],
        release=f'authentication@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

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


def get_user_details(access_token):
    """
    Gets the Google username and email address of the user.

    :param gh_access_token: The Google access token.
    :return: The Google username and email address of the user.
    """
    try:
        logger.info("Getting the Google username and email address...")
        res = requests.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token)
        data = json.loads(res.content)
        return data['name'], data['email']
    except Exception as e:
        raise RuntimeError(f"Error getting Google user details: {e}")


def handler(event, context):
    try:
        logger.info('Google Authentication started...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin, host = parse_header(event)
        validate_request_body(body, ['token'])

        token = body.get('token')
        username, email = get_user_details(token)

        data = {
            "name": username,
            "email": email
        }

        logger.info("Checking if company already exists...")
        if company_already_exists(email, db_cursor):
            company_id = get_company_id(email, db_cursor)
            access_token = generate_access_token(company_id)
            logger.info('Google Login successful: %s', email)
            return generate_success_response(origin, host, access_token)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, data, db_cursor)

        logger.info("Saving the access token...")
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
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
