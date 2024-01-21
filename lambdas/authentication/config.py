import os


class Config:
    """
    This class handles the configuration settings for the application.
    """
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
    POSTGRES_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    POSTGRES_DB = os.getenv('POSTGRES_DB')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
    GITHUB_FERNET_KEY = os.getenv('GITHUB_FERNET_KEY')

    SENTRY_DSN = os.getenv('SENTRY_DSN')

    @classmethod
    def validate(cls):
        """
        Validates that all necessary configuration variables are set.
        Raises an exception if any required configuration is missing.
        """
        required_variables = [
            'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB',
            'POSTGRES_USER', 'POSTGRES_PASSWORD', 'JWT_SECRET_KEY'
        ]
        missing_variables = [variable for variable in required_variables if not getattr(cls, variable)]

        if missing_variables:
            raise ValueError(f"Missing required configuration variables: {', '.join(missing_variables)}")


Config.validate()
