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


def parse_request_body(event):
    """
    Parses the request body from an event and returns it as a JSON object.

    :param event: The event object containing the request data.
    :return: Parsed JSON object from the request body.
    """
    try:
        body = event.get('body', '')
        if not body:
            raise ValueError("Empty body")
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")


def validate_request_body(body, required_fields):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields')


def parse_request_parameter(event, parameter_name):
    """
    Parses a request parameter from an event and returns it as a string.

    :param event: The event object containing the request data.
    :param parameter_name: The name of the parameter to parse.
    :return: The parsed parameter.
    """
    try:
        parameter = event.get('pathParameters', {}).get(parameter_name)
        if not parameter:
            raise ValueError(f"Missing required parameter: {parameter_name}")
        return parameter
    except Exception as e:
        raise ValueError(f"Error parsing parameter {parameter_name}: {e}")
