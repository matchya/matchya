import json
import datetime


# # define the DynamoDB table that Lambda will connect to
# tableName = "lambda-apigateway"

# # create the DynamoDB resource
# dynamo = boto3.resource('dynamodb').Table(tableName)

def register(event, context):

    body = json.loads(event['body'])
    company_name = body['company_name']
    email = body['email']
    github_account_url = body['github_account_url']
    created_at = str(datetime.datetime.now())

    # save to dynamodb
    # dynamo.save(company_name, email, github_account_url, created_at)
    # dynamo.put_item()

    company_id = 1  # get from dynamodb

    body = {
        "company_id": company_id,
        "created_at": created_at
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
