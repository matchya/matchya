import json
import datetime

import boto3

table_name = "CompanyInfo"
dynamo = boto3.resource('dynamodb').Table(table_name)


def register(event, context):

    body = json.loads(event['body'])
    company_id = '1'
    # TODO: retrieve these fields from the db
    # company_name = body['company_name']
    # email = body['email']
    # github_account_url = body['github_account_url']
    created_at = str(datetime.datetime.now())
    access_token = _generate_access_token(company_id)

    body = {
        'status': 'success',
        'payload': {
            'access_token': access_token,
            'created_at': created_at
        }
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response


def _generate_access_token(company_id):
    return f'{company_id}_access_token'
