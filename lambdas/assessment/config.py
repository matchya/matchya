import os


class Config:
    """
    This class handles the configuration settings for the application.
    """
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    POSTGRES_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    POSTGRES_DB = os.getenv('POSTGRES_DB')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
    QUESTION_GENERATION_PROCESSOR_QUEUE_URL = os.getenv('QUESTION_GENERATION_PROCESSOR_QUEUE_URL')
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    SERVICE_NAME = os.getenv('SERVICE_NAME')

    @classmethod
    def validate(cls):
        """
        Validates that all necessary configuration variables are set.
        Raises an exception if any required configuration is missing.
        """
        required_variables = [
            'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB',
            'POSTGRES_USER', 'POSTGRES_PASSWORD', 'OPENAI_API_KEY',
            'QUESTION_GENERATION_PROCESSOR_QUEUE_URL', 'SERVICE_NAME'
        ]
        missing_variables = [variable for variable in required_variables if not getattr(cls, variable)]

        if missing_variables:
            raise ValueError(f"Missing required configuration variables: {', '.join(missing_variables)}")


Config.validate()
