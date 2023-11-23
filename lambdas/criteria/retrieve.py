import json

from utils.response import generate_response, generate_success_response

def handler(event, context):
    parameter = event.get('pathParameters')
    if parameter is None:
        return generate_response(400, json.dumps({"message": "Missing required parameters"}))
    position_id = parameter.get('id')

    if position_id is None:
        return generate_response(400, json.dumps({"message": "Missing required parameters"}))

    # TODO: Get Criteria Full Messages by position id from Database

    criteria = ["Criteria 1", "Criteria 2", "Criteria 3"]   # mock
    body = {
        "criteria": criteria,
    }

    return generate_success_response(body)
