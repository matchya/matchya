import json
from typing import Any, Dict


COMMON_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': True,
    'Content-Type': 'application/json'
}


def generate_response(origin_domain: str, status_code: int, body: Any) -> Dict[str, Any]:
    """
    Generates a HTTP response object.

    :param status_code: The HTTP status code for the response.
    :param body: The body of the response, can be any type that is convertible to a string.
    :return: A dictionary representing the HTTP response.
    """
    if origin_domain:
        COMMON_HEADERS['Access-Control-Allow-Origin'] = origin_domain
    return {
        "statusCode": status_code,
        "headers": COMMON_HEADERS,
        "body": body
    }


def generate_error_response(origin_domain: str, status_code: int, message: str):
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
    return generate_response(origin_domain=origin_domain, status_code=status_code, body=json.dumps(body))


def generate_success_response(origin_domain: str, body: Any) -> Dict[str, Any]:
    """
    Generates a success response with the access token.

    :param body: The generated access token.
    :return: A success response containing the access token and current timestamp.
    """
    body = {
        'status': 'success',
        'payload': body
    }
    return generate_response(origin_domain=origin_domain, status_code=200, body=json.dumps(body))
