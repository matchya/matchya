import datetime
import json
import http.cookies as Cookie
from typing import Any, Dict


COMMON_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
}


def generate_response(status_code: int, body: Any, cookie=None) -> Dict[str, Any]:
    """
    Generates a HTTP response object.

    :param status_code: The HTTP status code for the response.
    :param body: The body of the response, can be any type that is convertible to a string.
    :return: A dictionary representing the HTTP response.
    """
    if cookie:
        COMMON_HEADERS['Set-Cookie'] = cookie.output(header='', sep='')
    return {
        "statusCode": status_code,
        "body": body,
        "headers": COMMON_HEADERS
    }

def generate_error_response(status_code: int, message: str):
    """
    Generates an error response object.

    :param status_code: The HTTP status code for the response.
    :param message: The error message to be included in the response.
    :return: A dictionary representing the HTTP response.
    """
    body = {
        'status': 'error',
        'message': message
    }
    return generate_response(status_code=status_code, body=json.dumps(body))


def generate_success_response(access_token):
    """
    Generates a success response with the access token.

    :param access_token: The generated access token.
    :return: A success response containing the access token and current timestamp.
    """
    cookie = Cookie.SimpleCookie()
    cookie['session'] = access_token
    cookie['session']['httponly'] = True
    cookie['session']['path'] = '/'

    # TODO: change this to 24 hours once it is functioning correctly
    expiration = datetime.datetime.now() + datetime.timedelta(minutes=3)
    cookie['session']['expires'] = expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT")

    body = {
        'status': 'success',
    }
    return generate_response(status_code=200, body=json.dumps(body), cookie=cookie)
