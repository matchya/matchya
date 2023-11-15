import json


def hello(event, context):
    body = {
        "message": "Registrar endpoint! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
