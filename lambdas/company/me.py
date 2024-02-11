import os

from client.postgres import PostgresDBClient
from client.sentry import SentryClient
from entity.company import Company
from repo.company import CompanyRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
response_generator = ResponseGenerator()


def handler(event, context):
    logger.info("Start the lambda execution")
    try:
        # initializing the parser
        parser = RequestParser(event)

        # parsing the event
        origin = parser.parse_header()
        cookie_body = parser.parse_cookie_body()
        response_generator.origin_domain = origin

        entity = Company(id=cookie_body.get('company_id'))
        with postgres_client as db_client:
            company_repo = CompanyRepository(db_client)
            company = company_repo.get_company_by_id(entity.id)
        return response_generator.generate_success_response({
            "id": company["id"],
            "name": company["name"],
            "email": company["email"],
        })
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f"Failed to retrieve company ({str(status_code)}): {e}")
        return response_generator.generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f"Failed to retrieve company ({str(status_code)}): {e}")
        return response_generator.generate_error_response(status_code, str(e))
