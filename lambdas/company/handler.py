import logging

import psycopg2

from config import Config

from utils.request import parse_header, parse_request_parameter
from utils.response import generate_success_response, generate_error_response

# Logger
logger = logging.getLogger('company')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

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


def get_company_by_id(company_id):
    """
    Retrieves the 'message' attribute of criteria for a given position_id from the database.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    try:
        db_cursor.execute(f"SELECT id, name, email, github_username FROM company WHERE id = '{company_id}'")
        result = db_cursor.fetchone()
        if not result:
            raise ValueError(f"Company not found for id: {company_id}")
        company = {
            "id": result[0],
            "name": result[1],
            "email": result[2],
            "github_username": result[3],
        }
        return company
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve company: {e}")
    

def get_repositories_by_company_id(company_id):
    """
    Retrieves the 'message' attribute of criteria for a given position_id from the database.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    try:
        db_cursor.execute(f"SELECT repository_name FROM company_repository WHERE company_id = '{company_id}'")
        result = db_cursor.fetchall()
        if not result:
            return []
        repositories = [item[0] for item in result]
        return repositories
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve repositories: {e}")
    

def get_positions_by_company_id(company_id):
    """
    Retrieves the 'message' attribute of criteria for a given position_id from the database.
    
    :param position_id: Unique identifier for the position.
    :return: List of messages for the given position_id.
    """
    try:
        db_cursor.execute(f"SELECT id, name FROM position WHERE company_id = '{company_id}'")
        result = db_cursor.fetchall()
        if not result:
            return []
        positions = [{"id": item[0], "name": item[1]} for item in result]
        return positions
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve positions: {e}")
    

def retrieve(event, context):
    try:
        logger.info(f"Received retrive request: {event}")
        connect_to_db()
        company_id = parse_request_parameter(event, 'id')
        origin = parse_header(event)
        company = get_company_by_id(company_id)
        repositories = get_repositories_by_company_id(company_id)
        positions = get_positions_by_company_id(company_id)
        body = {
            "id": company["id"],
            "name": company["name"],
            "email": company["email"],
            "github_username": company["github_username"],
            "repository_names": repositories,
            "positions": positions
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
        if db_conn:
            db_conn.close()
