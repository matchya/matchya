from typing import Any, Dict


COMMON_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': True,
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
