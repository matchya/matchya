import os


class Config:
    ENVIRONMENT = os.environ.get('ENVIRONMENT', 'dev')
