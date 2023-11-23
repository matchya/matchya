from utils.response import generate_success_response

def handler(event, context):
    parameter = event.get('pathParameters')
    if parameter is None:
        return {'statusCode': 400, 'body': 'Missing required parameters'}
    position_id = parameter.get('id')

    if position_id is None:
        return {'statusCode': 400, 'body': 'Position id is required'}

    # TODO: Get Criteria Full Messages by position id from Database

    criteria = ["Criteria 1", "Criteria 2", "Criteria 3"]   # mock
    body = {
        "criteria": criteria,
    }

    return generate_success_response(body)
