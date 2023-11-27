import json


def hello(event, context):
    # TODO: remove once cookie is confirmed working
    print("EVENT: ", event)
    body = {
        "message": "Hello endpoint! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
