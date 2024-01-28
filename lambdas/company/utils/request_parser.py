import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class RequestParser:
    def __init__(self, event):
        self.event = event

    def parse_header(self):
        """
        Parses the request header from an event and extracts the origin and host to resolve cors issue

        :param event: The event object containing the request data.
        :return: origin and the host
        """
        logger.info('parse_header')
        try:
            headers = self.event['headers']
            origin = headers.get('origin')
            if not origin:
                raise ValueError('Origin not included in headers')
            return origin
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parse_request_parameter(self, parameter_name):
        """
        Parses a request parameter from an event and returns it as a string.

        :param event: The event object containing the request data.
        :param parameter_name: The name of the parameter to parse.
        :return: The parsed parameter.
        """
        logger.info(f'parse_request_parameter: {parameter_name}')
        try:
            parameter = self.event.get('pathParameters', {}).get(parameter_name)
            if not parameter:
                raise ValueError(f"Missing required parameter: {parameter_name}")
            return parameter
        except Exception as e:
            raise ValueError(f"Error parsing parameter {parameter_name}: {e}")

    def parse_request_body(self):
        """
        Parses the request body from an event and returns it as a JSON object.

        :param event: The event object containing the request data.
        :return: Parsed JSON object from the request body.
        """
        logger.info('parse_request_body')
        try:
            body = self.event.get('body', '')
            if not body:
                raise ValueError("Empty body")
            return json.loads(body)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parse_cookie_body(self):
        logger.info('parse_cookie_body')
        try:
            body = self.event.get('requestContext').get('authorizer')
            if not body:
                raise ValueError('Body not included in request')
            return body
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")
