import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class RequestParser:
    def __init__(self, event):
        self.event = event

    def parser_cookie_header(self):
        """
        Parses the request header from an event and extracts the origin and host to resolve cors issue

        :param event: The event object containing the request data.
        :return: origin and the host
        """
        logger.info('Parsing request header')
        try:
            headers = self.event.get('headers', {})
            cookie_header = headers.get('Cookie', '')
            if not cookie_header:
                raise ValueError('Cookie not included in headers')
            logger.info('Successfully parsed request header')
            return cookie_header
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parser_authorization_header(self):
        """
        Parses the request header from an event and extracts the origin and host to resolve cors issue

        :param event: The event object containing the request data.
        :return: origin and the host
        """
        logger.info('Parsing request header')
        try:
            headers = self.event.get('headers', {})
            cookie_header = headers.get('Authorization', '')
            if not cookie_header:
                raise ValueError('Authorization not included in headers')
            logger.info('Successfully parsed request header')
            return cookie_header
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")
