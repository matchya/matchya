import os

from client.s3 import S3Client
from client.sentry import SentryClient
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
s3_client = S3Client()
response_generator = ResponseGenerator()


def handler(event, context):
    """
    Handles the lambda function call.
    """
    logger.info("Starting the lambda execution")

    try:
        # initialize the parser
        parser = RequestParser(event)
        # parsing the event
        interview_id, question_id = parser.parser_query_string_parameters()
        origin = parser.parse_header()
        response_generator.origin_domain = origin
        logger.info(f'Interview ID: {interview_id}')
        logger.info(f'Question ID: {question_id}')
        presigned_metadata = s3_client.retrieve_presigned_metadata_for_upload(interview_id, question_id)
        return response_generator.generate_success_response(presigned_metadata)
    except Exception as e:
        status_code = 400
        return response_generator.generate_error_response(status_code, str(e))
