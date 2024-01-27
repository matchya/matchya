
import os
import psycopg2

from client.postgres import PostgresDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class CompanyRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def company_already_exists(self, email):
        """
        Checks if the company already exists in the database.

        :param email: The email address of the company.
        :return: True if the company already exists, False otherwise.
        """
        logger.info(f'Checking if company already exists: {email}')
        sql = "SELECT id FROM company WHERE email = %s;"
        try:
            self.db_client.execute(sql, (email,))
            return self.db_client.fetchone() is not None
        except Exception as e:
            raise RuntimeError(f"Error checking if company already exists: {e}")

    def get_company_id(self, email):
        """
        Retrieves the company id from the database based on the provided email.

        :param email: The email address used to query the company id.
        :return: The first item from the database query result.
        """
        logger.info(f'Retrieving company id: {email}')
        try:
            self.db_client.execute('SELECT id FROM company WHERE email = %s', (email,))
            result = self.db_client.fetchall()
        except Exception as e:
            raise RuntimeError(f"Error retrieving company id: {e}")
        if not result:
            raise ValueError('Company not found. Please try again.')
        logger.info('Successfully retrieved company id')
        return result[0][0]

    def create_company_record(self, company_id: str, body: dict):
        """
        Creates a new company record in the database.

        :param company_id: Unique identifier for the company.
        :param body: The request body containing company data.
        """
        logger.info(f'Creating a new company record: {company_id}')
        sql = "INSERT INTO company (id, name, email) VALUES (%s, %s, %s, %s);"
        try:
            self.db_client.execute(sql, (company_id, body['name'], body['email']))
            logger.info('Successfully created a new company record')
        except psycopg2.IntegrityError:
            raise RuntimeError(f"Email address is already used: {body['email']}")
        except Exception as e:
            raise RuntimeError(f"Error saving to company table: {e}")
