import os


class Config:
    """
    This class handles the configuration settings for the application.
    """
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    SERVICE_NAME = os.getenv('SERVICE_NAME')
