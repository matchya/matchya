import json

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
    