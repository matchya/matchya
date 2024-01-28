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
