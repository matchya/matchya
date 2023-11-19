import json
import boto3
import requests
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# DynamoDB
environment = os.environ.get('ENVIRONMENT')
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')


def hello(event, context):
    body = json.loads(event.get("body"))
    name = body.get("name")
    email = body.get("email")
    github_account_url = body.get("github_account_url")
    company_id = body.get("company_id")
    criteria_id = "f89e96d9-f62c-4d9c-bf24-91e0c9597bf6"

    tech_stack = get_tech_stack(criteria_id)
    candidate_score = evaluate_candidate(tech_stack, github_account_url)

    store_data(criteria_id, company_id, name, email, github_account_url, candidate_score)

    return {"statusCode": 200, "body": json.dumps(candidate_score)}


def get_tech_stack(criteria_id):
    url = "https://5b0c22lpgf.execute-api.us-east-1.amazonaws.com/dev/criteria/" + criteria_id
    res = requests.get(url)
    data = json.loads(res.content)
    tech_stack = data.get("criteria")

    return tech_stack

def evaluate_candidate(tech_stack, github_account_url):
    # TODO 1: Get github information using github api (used_languages, packages)
    # TODO 2: Ask ChatGPT to evaluate the candidate

    # ChatGPT JSON response
    chatgpt_evaluation = None
    # chatgpt_evaluation = {
    #     "total_score": "number",
    #     "details": "string"
    #     "assessments": [
    #         {
    #             "criteria": "string",
    #             "score": "number",
    #             "reason": "string"
    #         },
    #     ]
    # }

    return chatgpt_evaluation


def store_data(criteria_id, company_id, name, email, github_account_url, candidate_score):
    # TODO: Store data in DynamoDB
    pass