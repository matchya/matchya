import jwt
import bcrypt

from config import Config


def generate_access_token(company_id):
    payload = {
        "company_id": company_id
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")


def hash_github_access_token(access_token: str) -> bytes:
    """
    Hashes a password using bcrypt.

    :param password: The plaintext password to be hashed.
    :return: The hashed password as a byte string.
    """
    token_bytes = access_token.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(token_bytes, salt)