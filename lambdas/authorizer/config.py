import os


class Config:
    """
    This class handles the configuration settings for the application.
    """
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    SERVICE_NAME = os.getenv('SERVICE_NAME')

    @classmethod
    def validate(cls):
        """
        This method checks if all necessary configuration variables are set.
        It raises an exception if any required configuration is missing.
        """
        required_variables = ['JWT_SECRET_KEY', 'SERVICE_NAME']
        missing_variables = [variable for variable in required_variables if not getattr(cls, variable)]

        if missing_variables:
            raise ValueError(f"Missing required configuration variables: {', '.join(missing_variables)}")


Config.validate()
