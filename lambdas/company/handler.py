import json


def retrieve(event, context):
    body = {
        "message": "Retrieve Company is called!",
        "input": event,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
