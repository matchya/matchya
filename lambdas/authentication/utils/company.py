import psycopg2

from utils.token import encrypt_github_access_token


def company_already_exists(email, db_cursor):
    """
    Checks if the company already exists in the database.

    :param email: The email address of the company.
    :return: True if the company already exists, False otherwise.
    """
    sql = "SELECT id FROM company WHERE email = %s;"
    try:
        db_cursor.execute(sql, (email,))
        return db_cursor.fetchone() is not None
    except Exception as e:
        raise RuntimeError(f"Error checking if company already exists: {e}")


def get_company_id(email, db_cursor):
    """
    Retrieves the company id from the database based on the provided email.

    :param email: The email address used to query the company id.
    :return: The first item from the database query result.
    """
    try:
        db_cursor.execute('SELECT id FROM company WHERE email = %s', (email,))
        result = db_cursor.fetchall()
    except Exception as e:
        raise RuntimeError(f"Error retrieving company id: {e}")
    if not result:
        raise ValueError('Company not found. Please try again.')

    return result[0][0]


def create_company_record(company_id: str, body: dict, db_cursor):
    """
    Creates a new company record in the database.

    :param company_id: Unique identifier for the company.
    :param body: The request body containing company data.
    """
    sql = "INSERT INTO company (id, name, email, github_access_token) VALUES (%s, %s, %s, %s);"
    try:
        github_access_token = body.get('gihub_access_token', None)
        encrypted = encrypt_github_access_token(github_access_token) if github_access_token else None
        db_cursor.execute(sql, (company_id, body['name'], body['email'], encrypted))
    except psycopg2.IntegrityError:
        raise RuntimeError(f"Email address is already used: {body['email']}")
    except Exception as e:
        raise RuntimeError(f"Error saving to company table: {e}")
