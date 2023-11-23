import os


class Config:
    ENVIRONMENT = os.environ.get('ENVIRONMENT')
    GITHUB_REST_API_HEADERS = {'Authorization-Type': "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"}
    GITHUB_API_REPO_URL = "https://api.github.com/repos/"
    GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql"
