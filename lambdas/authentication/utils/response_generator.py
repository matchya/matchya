import datetime
import json
import http.cookies as Cookie
import os
from typing import Any, Dict

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class ResponseGenerator:
    COMMON_HEADERS = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Credentials': True,
        'Content-Type': 'application/json'
    }

    def __init__(self):
        self._origin_domain = None
        self._host_domain = None

    @property
    def origin_domain(self):
        return self._origin_domain

    @origin_domain.setter
    def origin_domain(self, value):
        self._origin_domain = value

    @property
    def host_domain(self):
        return self._host_domain

    @host_domain.setter
    def host_domain(self, value):
        self._host_domain = value

    def _generate_response(self, status_code: int, body: Any, cookie=None) -> Dict[str, Any]:
        """
        Generates a HTTP response object.

        :param status_code: The HTTP status code for the response.
        :param body: The body of the response, can be any type that is convertible to a string.
        :return: A dictionary representing the HTTP response.
        """
        logger.info(f'Generating response: {status_code}, {body}')
        headers = self.COMMON_HEADERS.copy()
        if cookie:
            headers['Set-Cookie'] = cookie.output(header='', sep='')
        if self.origin_domain:
            headers['Access-Control-Allow-Origin'] = self.origin_domain
        return {
            "statusCode": status_code,
            "body": body,
            "headers": headers
        }

    def generate_error_response(self, status_code: int, message: str):
        """
        Generates an error response object.

        :param status_code: The HTTP status code for the response.
        :param message: The error message to be included in the response.
        :return: A dictionary representing the HTTP response.
        """
        logger.info(f'Generating error response: {status_code}, {message}')
        body = {
            'status': 'error',
            'message': message
        }
        return self._generate_response(status_code=status_code, body=json.dumps(body))

    def generate_cookie_success_response(self, access_token: str) -> Dict[str, Any]:
        """
        Generates a success response with the access token.

        :param access_token: The generated access token.
        :return: A success response containing the access token and current timestamp.
        """
        logger.info(f'Generating success response: {access_token}')
        cookie = Cookie.SimpleCookie()
        cookie['t'] = access_token
        cookie['t']['httponly'] = True
        cookie['t']['domain'] = self.host_domain
        cookie['t']['path'] = '/'
        cookie['t']['samesite'] = None
        cookie['t']['secure'] = True

        expiration = datetime.datetime.now() + datetime.timedelta(days=1)
        cookie['t']['expires'] = expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT")

        body = {
            'status': 'success',
        }
        return self._generate_response(status_code=200, body=json.dumps(body), cookie=cookie)

    def generate_invitation_success_response(self, payload=None) -> Dict[str, Any]:
        """
        Generates a success response with the access token.

        :param body: The generated access token.
        :return: A success response containing the access token and current timestamp.
        """
        logger.info(f'Generating invitation success response: {payload}')
        body = {
            'status': 'success'
        }
        if payload is not None:
            body['payload'] = payload
        return self._generate_response(status_code=200, body=json.dumps(body))

    def generate_logout_response(self):
        logger.info('Generating logout response')
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': self.origin_domain,
            'Access-Control-Allow-Credentials': 'true',
            'Set-Cookie': f't=; HttpOnly; Domain={self.host_domain}; Path=/; Max-Age=0; SameSite=None; Secure'
        }
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': 'success'})
        }
