import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class RequestParser:
    def __init__(self, event):
        self.event = event

    def parse_header(self) -> str:
        """
        Parses the request header from an event and extracts the origin and host to resolve cors issue

        :param event: The event object containing the request data.
        :return: origin and the host
        """
        logger.info('Parsing request header')
        try:
            headers = self.event['headers']
            origin = headers.get('origin')
            if not origin:
                raise ValueError('Origin not included in headers')
            logger.info('Successfully parsed request header')
            return origin
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parser_query_string_parameters(self):
        interview_id = self.event.get('queryStringParameters', {}).get('interview_id', None)
        question_id = self.event.get('queryStringParameters', {}).get('question_id', None)
        return interview_id, question_id
