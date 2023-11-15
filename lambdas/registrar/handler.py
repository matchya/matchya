import json
import datetime

# # serverless invoke local --function hello --data '{"body": {"company_name": "matchya", "email": "mathcyateam@gmail.com", "github_account_url": "https://github.com/takeshi8989"}}'


# # define the DynamoDB table that Lambda will connect to
# tableName = "lambda-apigateway"

# # create the DynamoDB resource
# dynamo = boto3.resource('dynamodb').Table(tableName)

def register(event, context):

    company_name = event['body']['company_name']
    email = event['body']['email']
    github_account_url = event['body']['github_account_url']
    created_at = str(datetime.datetime.now())

    # save to dynamodb
    # dynamo.save(company_name, email, github_account_url, created_at)
    # dynamo.put_item()

    company_id = 1  # get from dynamodb

    body = {
        "company_id": company_id,
        "created_at": created_at
    }

    response = {"status": 200, "payload": json.dumps(body)}

    return response
