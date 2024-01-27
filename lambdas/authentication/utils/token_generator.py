import jwt
from cryptography.fernet import Fernet

from config import Config


class TokenGenerator:
    @staticmethod
    def generate_access_token(company_id):
        payload = {
            "company_id": company_id
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

    @staticmethod  # NOT IN USE!
    def encrypt_github_access_token(access_token: str) -> bytes:
        """
        Hashes a GitHub access token.

        :param access_token: The access token to be hashed.
        :return: The hashed access token as a byte string.
        """

        key = Config.GITHUB_FERNET_KEY
        cipher_suite = Fernet(key.encode())
        return cipher_suite.encrypt(access_token.encode('utf-8'))
