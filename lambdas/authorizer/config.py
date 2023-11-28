import os


class Config:
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
