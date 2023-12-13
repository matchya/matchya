import jwt
from cryptography.fernet import Fernet

from config import Config


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


def decrypt_github_access_token(encrypted_token: bytes) -> str:
    """
    Decrypts a GitHub access token.

    :param encrypted_token: The encrypted access token to be decrypted.
    :return: The decrypted access token as a string.
    """
    if isinstance(encrypted_token, memoryview):
        encrypted_token = encrypted_token.tobytes()
    key = Config.GITHUB_FERNET_KEY
    cipher_suite = Fernet(key.encode())
    return cipher_suite.decrypt(encrypted_token).decode()
