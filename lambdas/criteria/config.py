import os


class Config:
    ENVIRONMENT = os.environ.get('ENVIRONMENT')
    GITHUB_REST_API_HEADERS = {'Authorization-Type': "Bearer " + os.environ['GITHUB_TOKEN']}
    GITHUB_API_REPO_URL = "https://api.github.com/repos/"

    GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql"
    GITHUB_GRAPHQL_API_HEADERS = {"Authorization": "Bearer " + os.environ['GITHUB_TOKEN']}
