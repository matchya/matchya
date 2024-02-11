import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class RequestParser:
    def __init__(self, event):
        self.event = event
        logger.info(f'Successfully initialized request parser with event: {event}')

    def parse_header(self):
        """
        Parses the request header from an event and extracts the origin and host to resolve cors issue

        :param event: The event object containing the request data.
        :return: origin and the host
        """
        logger.info('Parsing request header')
        try:
            headers = self.event['headers']
            origin = headers.get('origin')
            host = headers.get('Host')
            if not origin:
                raise ValueError('Origin not included in headers')
            if not host:
                raise ValueError('Host not included in headers')
            logger.info('Successfully parsed request header')
            return origin, host
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parse_request_parameter(self, parameter_name):
        """
        Parses a request parameter from an event and returns it as a string.

        :param event: The event object containing the request data.
        :param parameter_name: The name of the parameter to parse.
        :return: The parsed parameter.
        """
        logger.info(f'Parsing request parameter {parameter_name}')
        try:
            parameter = self.event.get('pathParameters', {}).get(parameter_name)
            if not parameter:
                raise ValueError(f"Missing required parameter: {parameter_name}")
            logger.info(f'Successfully parsed request parameter {parameter_name}')
            return parameter
        except Exception as e:
            raise ValueError(f"Error parsing parameter {parameter_name}: {e}")

    def parse_request_body(self):
        """
        Parses the request body from an event and returns it as a JSON object.

        :param event: The event object containing the request data.
        :return: Parsed JSON object from the request body.
        """
        logger.info('Parsing request body')
        try:
            body = self.event.get('body', '')
            if not body:
                raise ValueError("Empty body")
            logger.info('Successfully parsed request body')
            return json.loads(body)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    # deprecate this since its same as below
    def parse_cookie_body(self):
        logger.info('Parsing cookie body')
        try:
            body = self.event.get('requestContext').get('authorizer')
            if not body:
                raise ValueError('Body not included in request')
            logger.info('Successfully parsed cookie body')
            return body
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")

    def parse_authorizer_context(self):
        logger.info('Parsing cookie body')
        try:
            body = self.event.get('requestContext').get('authorizer')
            if not body:
                raise ValueError('Authorizer Context not included in request')
            logger.info('Successfully parsed authorizer context')
            return body
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in request body: {e}")
