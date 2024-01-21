import json
import logging

import psycopg2
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.request import parse_header, parse_cookie_body
from utils.response import generate_success_response, generate_error_response

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
        release=f'company@{version}',
        traces_sample_rate=0.5,
        profiles_sample_rate=1.0,
    )

# Logger
logger = logging.getLogger('company me')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# Postgres
db_conn = None
db_cursor = None


def connect_to_db():
    """
    Reconnects to the database.
    """
    logger.info("Connecting to the db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_company_by_id(company_id):
    """
    Retrieves the company for a given company_id from the database.

    :param company_id: Unique identifier for the company.
    :return: Company object for the given company_id.
    """
    logger.info("Getting the company by id...")
    try:
        db_cursor.execute(f"SELECT id, name, email FROM company WHERE id = '{company_id}'")
        result = db_cursor.fetchone()
        if not result:
            raise ValueError(f"Company not found for id: {company_id}")
        company = {
            "id": result[0],
            "name": result[1],
            "email": result[2]
        }
        return company
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve company: {e}")


def get_repositories_by_company_id(company_id):
    """
    Retrieves the repositories for a given company_id from the database.

    :param company_id: Unique identifier for the company.
    :return: List of repositories for the given company_id.
    """
    logger.info("Getting the repositories by company id...")
    try:
        db_cursor.execute(f"SELECT repository_name FROM company_repository WHERE company_id = '{company_id}'")
        result = db_cursor.fetchall()
        if not result:
            return []
        repositories = [item[0] for item in result]
        return repositories
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve repositories: {e}")


def handler(event, context):
    1 / 0
    logger.info(event)
    try:
        connect_to_db()
        logger.info(f"Receiving an event... {event}")
        origin = parse_header(event)
        cookie_body = parse_cookie_body(event)
        company_id = cookie_body.get('company_id')

        company = get_company_by_id(company_id)
        repositories = get_repositories_by_company_id(company_id)
        body = {
            "id": company["id"],
            "name": company["name"],
            "email": company["email"],
            "repository_names": repositories
        }
        logger.info(f"Retrieved company successfully: {body}")
        return generate_success_response(origin, body)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f"Failed to retrieve company ({str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f"Failed to retrieve company ({str(status_code)}): {e}")
        return generate_error_response(origin, status_code, str(e))
    finally:
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
