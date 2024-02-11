import os

from client.sentry import SentryClient
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
response_generator = ResponseGenerator()


def handler(event, context):
    """
    Handles user logout by clearing the httpOnly cookie.

    :param event: The event dictionary containing the HTTP request data.
    :param context: The context object providing runtime information.
    :return: A dictionary with a status code and the body of the response.
             The response body contains a message indicating successful logout.
    """
    logger.info("Starting the lambda execution")

    # initializing the parser
    parser = RequestParser(event)
    origin, host = parser.parse_header()
    response_generator.origin_domain = origin
    response_generator.host_domain = host

    return response_generator.generate_logout_response()
