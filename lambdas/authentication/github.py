# Currently deprecated. NOT IN USE!

import json
import requests
import logging
import uuid

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
logger = logging.getLogger('github authentication')
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

# Github
CLIENT_ID = Config.GITHUB_CLIENT_ID
CLIENT_SECRET = Config.GITHUB_CLIENT_SECRET


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


def get_github_access_token(code: str):
    """
    Gets the GitHub access token using the authorization code.

    :param code: The authorization code.
    :return: The GitHub access token.
    """
    logger.info("Getting the GitHub access token...")
    try:
        response = requests.post(
            'https://github.com/login/oauth/access_token',
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json={
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'code': code,
                'accept': 'json'
            }
        )
        content = json.loads(response.content)
        access_token = content.get('access_token')
        return access_token
    except Exception as e:
        raise RuntimeError(f"Error getting GitHub access token: {e}")


def get_user_details(gh_access_token):
    """
    Gets the GitHub username and email address of the user.

    :param gh_access_token: The GitHub access token.
    :return: The GitHub username and email address of the user.
    """
    try:
        logger.info("Getting the GitHub username and email address...")
        user_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'Bearer {gh_access_token}'}
        )
        user_details = json.loads(user_response.content)

        username = user_details.get('login', None)
        if not username:
            raise RuntimeError(f"Error getting username from GitHub: {user_details}")

        emails_response = requests.get(
            'https://api.github.com/user/emails',
            headers={'Authorization': f'Bearer {gh_access_token}'}
        )
        emails = json.loads(emails_response.content)

        email = next((item['email'] for item in emails if item['primary'] and item['verified']), None)

        return username, email
    except Exception as e:
        raise RuntimeError(f"Error getting GitHub user details: {e}")


def save_company_repositories(company_id: str, github_username: str, github_access_token: str):
    """
    Saves the repositories of the company to the database.

    :param company_id: Unique identifier for the company.
    :param github_username: The GitHub username of the company.
    """
    logger.info("Saving the company repositories...")
    repositories = get_company_repository_names(github_username, github_access_token)
    sql = "INSERT INTO company_repository (company_id, repository_name) VALUES"
    for repository in repositories:
        sql += f" ('{company_id}', '{repository}'),"
    sql = sql[:-1] + ';'
    try:
        db_cursor.execute(sql)
    except Exception as e:
        raise RuntimeError(f"Error saving company repository names: {e}")


def get_company_repository_names(github_username: str, github_access_token: str):
    """
    Gets the repositories of a company from GitHub.

    :param github_username: The GitHub username of the company.
    :param github_access_token: The GitHub access token of the company.
    :return: A list of repositories of the company.
    """
    logger.info("Getting the company repository names...")
    url = "https://api.github.com/user/repos"
    response = requests.get(url, headers={'Authorization': f'Bearer {github_access_token}'})
    if response.status_code == 404:
        raise RuntimeError(f"Repository not found for the User: {github_username}")
    if response.status_code != 200:
        raise RuntimeError(f"Error getting repositories from GitHub: {response.content}")
    repositories = response.json()
    repo_names = [repository['full_name'] for repository in repositories]
    return repo_names


def handler(event, context):
    try:
        logger.info('Github Authentication started...')
        connect_to_db()

        logger.info("Parsing the request body...")
        body = parse_request_body(event)
        logger.info("Parsing the request header...")
        origin, host = parse_header(event)
        validate_request_body(body, ['code'])

        code = body.get('code')
        github_access_token = get_github_access_token(code)
        username, email = get_user_details(github_access_token)

        data = {
            "name": username,
            "email": email,
            "github_access_token": github_access_token
        }

        logger.info("Checking if company already exists...")
        if company_already_exists(email, db_cursor):
            company_id = get_company_id(email, db_cursor)
            access_token = generate_access_token(company_id)
            logger.info('Github Login successful: %s', email)
            return generate_success_response(origin, host, access_token)

        company_id = str(uuid.uuid4())
        create_company_record(company_id, data, db_cursor)

        save_company_repositories(company_id, username, github_access_token)

        logger.info("Saving the access token...")
        access_token = generate_access_token(company_id)
        create_access_token_record(company_id, access_token)

        db_conn.commit()
        logger.info('Github Registration successful: %s', email)
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
