import os
import uuid

from client.dynamodb import DynamoDBClient
from client.postgres import PostgresDBClient
from client.google import GoogleClient
from client.sentry import SentryClient
from entity.token import Token
from repo.access_token import AccessTokenRepository
from repo.company import CompanyRepository
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator
from utils.token_generator import TokenGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
postgres_client = PostgresDBClient()
dynamodb_client = DynamoDBClient(table_name='AccessToken')
access_token_repo = AccessTokenRepository(dynamodb_client)
response_generator = ResponseGenerator()


def handler(event, context):
    logger.info('Starting the lambda execution')
    try:
        # initializing the parser
        parser = RequestParser(event)

        # parsing the event
        body = parser.parse_request_body()
        origin, host = parser.parse_header()
        response_generator.origin_domain = origin
        response_generator.host_domain = host

        # business logic
        token = Token(body.get('token'))
        username, email = GoogleClient.get_user_details(token.value)

        with postgres_client as db_client:
            company_repo = CompanyRepository(db_client)
            if company_repo.company_already_exists(email):
                company_id = company_repo.get_company_id(email)
                access_token = TokenGenerator.generate_company_access_token(company_id)
                return response_generator.generate_cookie_success_response(access_token)
            company_id = str(uuid.uuid4())
            company_repo.create_company_record(company_id, {
                "name": username,
                "email": email
            })
            access_token = TokenGenerator.generate_company_access_token(company_id)
            access_token_repo.create_access_token_record(company_id, access_token)

        return response_generator.generate_cookie_success_response(access_token)
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Login failed (status {str(status_code)}): {e}')
        return response_generator.generate_error_response(status_code, str(e))
    except Exception as e:
        status_code = 500
        logger.error(f'Login failed (status {str(status_code)}): {e}')
        return response_generator.generate_error_response(status_code, str(e))
