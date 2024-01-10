import json


def parse_header(event):
    """
    Parses the request header from an event and extracts the origin and host to resolve cors issue

    :param event: The event object containing the request data.
    :return: origin and the host
    """
    try:
        headers = event['headers']
        origin = headers.get('origin')
        if not origin:
            raise ValueError('Origin not included in headers')
        return origin
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def parse_cookie_body(event):
    try:
        body = event.get('requestContext').get('authorizer')
        if not body:
            raise ValueError('Missing required body')
        return body
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")