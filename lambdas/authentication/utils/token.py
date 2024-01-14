import jwt
from cryptography.fernet import Fernet

import boto3

from config import Config


# DynamoDB
dynamodb = boto3.resource('dynamodb')
access_token_table = dynamodb.Table(f'{Config.ENVIRONMENT}-AccessToken')


def create_access_token_record(company_id, access_token):
    """
    Creates a new access token record in the database.

    :param company_id: Unique identifier for the company associated with the token.
    :param access_token: The access token to be saved.
    """
    access_token_info = {
        'token_id': access_token,
        'company_id': company_id
    }
    try:
        access_token_table.put_item(Item=access_token_info)
    except Exception as e:
        raise RuntimeError(f"Error saving to access token table: {e}")


def generate_access_token(company_id):
    payload = {
        "company_id": company_id
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")


def encrypt_github_access_token(access_token: str) -> bytes:
    """
    Hashes a GitHub access token.

    :param access_token: The access token to be hashed.
    :return: The hashed access token as a byte string.
    """

    key = Config.GITHUB_FERNET_KEY
    cipher_suite = Fernet(key.encode())
    return cipher_suite.encrypt(access_token.encode('utf-8'))
