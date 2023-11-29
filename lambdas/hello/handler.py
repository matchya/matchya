import json

COMMON_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': True,
    "Content-Type": "application/json",
}


def hello(event, context):
    # TODO: remove once cookie is confirmed working
    print("EVENT: ", event)
    body = {
        "message": "Hello endpoint! Your function executed successfully!",
        "input": event,
    }
    origin = event['headers'].get('origin')
    if not origin:
        return {"statusCode": 400, "body": "Origin doesn't exist", "headers": COMMON_HEADERS}

    COMMON_HEADERS['Access-Control-Allow-Origin'] = origin

    return {"statusCode": 200, "body": json.dumps(body), "headers": COMMON_HEADERS}
