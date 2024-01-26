import json
import os
from typing import Any, Dict

from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class ResponseGenerator:
    COMMON_HEADERS = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Credentials': True,
        'Content-Type': 'application/json'
    }

    def __init__(self):
        self._origin_domain = None

    @property
    def origin_domain(self):
        return self._origin_domain

    @origin_domain.setter
    def origin_domain(self, origin_domain):
        self._origin_domain = origin_domain

    def _generate_response(self, status_code: int, body: Any) -> Dict[str, Any]:
        """
        Generates a HTTP response object.

        :param status_code: The HTTP status code for the response.
        :param body: The body of the response, can be any type that is convertible to a string.
        :return: A dictionary representing the HTTP response.
        """
        logger.info(f'_generate_response: {status_code}, {body}')
        if self._origin_domain:
            self.COMMON_HEADERS['Access-Control-Allow-Origin'] = self._origin_domain
        return {
            "statusCode": status_code,
            "headers": self.COMMON_HEADERS,
            "body": body
        }

    def generate_error_response(self, status_code: int, message: str) -> Dict[str, Any]:
        """
        Generates an error response object.

        :param status_code: The HTTP status code for the response.
        :param message: The error message to be included in the response.
        :return: A dictionary representing the HTTP response.
        """
        logger.info(f'generate_error_response: {status_code}, {message}')
        body = {
            'status': 'error',
            'message': message
        }
        return self._generate_response(status_code=status_code, body=json.dumps(body))

    def generate_success_response(self, payload=None) -> Dict[str, Any]:
        """
        Generates a success response with the access token.

        :param body: The generated access token.
        :return: A success response containing the access token and current timestamp.
        """
        logger.info(f'generate_success_response: {payload}')
        body = {
            'status': 'success'
        }
        if payload is not None:
            body['payload'] = payload
        return self._generate_response(status_code=200, body=json.dumps(body))
