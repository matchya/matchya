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

    @classmethod
    def _generate_response(cls, origin_domain: str, status_code: int, body: Any, cookie=None) -> Dict[str, Any]:
        """
        Generates a HTTP response object.

        :param status_code: The HTTP status code for the response.
        :param body: The body of the response, can be any type that is convertible to a string.
        :return: A dictionary representing the HTTP response.
        """
        logger.info(f'Generating response: {status_code}, {body}')
        headers = cls.COMMON_HEADERS.copy()
        if cookie:
            headers['Set-Cookie'] = cookie.output(header='', sep='')
        if origin_domain:
            headers['Access-Control-Allow-Origin'] = origin_domain
        return {
            "statusCode": status_code,
            "body": body,
            "headers": headers
        }

    @classmethod
    def generate_error_response(cls, origin: str, status_code: int, message: str):
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
        return cls.generate_response(origin_domain=origin, status_code=status_code, body=json.dumps(body))

    @classmethod
    def generate_success_response(cls, origin: str, host: str, access_token: str) -> Dict[str, Any]:
        """
        Generates a success response with the access token.

        :param access_token: The generated access token.
        :return: A success response containing the access token and current timestamp.
        """
        logger.info(f'Generating success response: {access_token}')
        cookie = Cookie.SimpleCookie()
        cookie['t'] = access_token
        cookie['t']['httponly'] = True
        cookie['t']['domain'] = host
        cookie['t']['path'] = '/'
        cookie['t']['samesite'] = None
        cookie['t']['secure'] = True

        expiration = datetime.datetime.now() + datetime.timedelta(days=1)
        cookie['t']['expires'] = expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT")

        body = {
            'status': 'success',
        }
        return cls._generate_response(origin_domain=origin, status_code=200, body=json.dumps(body), cookie=cookie)

    @classmethod
    def generate_logout_response(cls, origin: str, host: str):
        logger.info('Generating logout response')
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Set-Cookie': f't=; HttpOnly; Domain={host}; Path=/; Max-Age=0; SameSite=None; Secure'
        }
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': 'success'})
        }
