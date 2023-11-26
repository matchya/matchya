import json


def retrieve(event, context):
    body = {
        "message": "Retrieve Position Lambda",
        "input": event,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
