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
    