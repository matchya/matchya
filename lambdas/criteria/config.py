import os


class Config:
    ENVIRONMENT = os.environ.get('ENVIRONMENT')

    DYNAMO_CRITERIA_TABLE_NAME = f'{ENVIRONMENT}-Criterion'

    POSTGRES_HOST = os.environ.get('POSTGRES_HOST')
    POSTGRES_PORT = os.environ.get('POSTGRES_PORT')
    POSTGRES_DB = os.environ.get('POSTGRES_DB')
    POSTGRES_USER = os.environ.get('POSTGRES_USER')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    
    GITHUB_REST_API_HEADERS = {'Authorization-Type': "Bearer " + os.environ['GITHUB_TOKEN']}
    GITHUB_API_REPO_URL = "https://api.github.com/repos/"

    GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql"
    GITHUB_GRAPHQL_API_HEADERS = {"Authorization": "Bearer " + os.environ['GITHUB_TOKEN']}
