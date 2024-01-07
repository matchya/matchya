import os
from default_criteria import DEFAULT_CRITERIA


class Config:
    """
    This class handles the configuration settings for the application.
    """
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')

    DYNAMO_CRITERIA_TABLE_NAME = f'{ENVIRONMENT}-Criterion'

    POSTGRES_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    POSTGRES_DB = os.getenv('POSTGRES_DB')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

    CHECKLIST_EVALUATION_PROCESSOR_QUEUE_URL = os.getenv('CHECKLIST_EVALUATION_PROCESSOR_QUEUE_URL')
    CHECKLIST_GENERATION_PROCESSOR_QUEUE_URL = os.getenv('CHECKLIST_GENERATION_PROCESSOR_QUEUE_URL')

    GITHUB_API_HEADERS = {'Authorization': "Bearer " + os.environ['GITHUB_TOKEN']}
    GITHUB_API_REPO_URL = "https://api.github.com/repos/"
    GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql"
    GITHUB_FERNET_KEY = os.getenv('GITHUB_FERNET_KEY')

    DEFAULT_CRITERIA = DEFAULT_CRITERIA

    @classmethod
    def validate(cls):
        """
        Validates that all necessary configuration variables are set.
        Raises an exception if any required configuration is missing.
        """
        required_variables = [
            'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB', 'POSTGRES_USER',
            'POSTGRES_PASSWORD', 'CHECKLIST_EVALUATION_PROCESSOR_QUEUE_URL', 'CHECKLIST_GENERATION_PROCESSOR_QUEUE_URL',
            'GITHUB_API_HEADERS', 'GITHUB_API_REPO_URL', 'GITHUB_GRAPHQL_API_URL', 'GITHUB_FERNET_KEY'
        ]
        missing_variables = [variable for variable in required_variables if not getattr(cls, variable)]

        if missing_variables:
            raise ValueError(f"Missing required configuration variables: {', '.join(missing_variables)}")


Config.validate()
