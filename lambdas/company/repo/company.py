import os

from client.postgres import PostgresDBClient
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class CompanyRepository:
    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def get_company_by_id(self, company_id):
        """
        Retrieves the company for a given company_id from the database.

        :param company_id: Unique identifier for the company.
        :return: Company object for the given company_id.
        """
        logger.info("Getting the company by id...")
        try:
            self.db_client.execute(f"SELECT id, name, email FROM company WHERE id = '{company_id}'")
            result = self.db_client.fetchone()
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
