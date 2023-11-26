import jwt

from config import Config


def generate_access_token(company_id):
    payload = {
        "company_id": company_id
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")
