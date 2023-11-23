import datetime
import json
from typing import Any, Dict


COMMON_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
}


def generate_response(status_code: int, body: Any) -> Dict[str, Any]:
    """
    Generates a HTTP response object.

    :param status_code: The HTTP status code for the response.
    :param body: The body of the response, can be any type that is convertible to a string.
    :return: A dictionary representing the HTTP response.
    """
    return {
        "statusCode": status_code,
        "body": body,
        "headers": COMMON_HEADERS
    }


def generate_success_response(access_token):
    """
    Generates a success response with the access token.

    :param access_token: The generated access token.
    :return: A success response containing the access token and current timestamp.
    """
    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': str(datetime.datetime.now())
        }
    }
    return generate_response(status_code=200, body=json.dumps(body))
