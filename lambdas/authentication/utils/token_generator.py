import time
import jwt

from config import Config


class TokenGenerator:
    @staticmethod
    def generate_company_access_token(company_id):
        payload = {
            "company_id": company_id
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

    @staticmethod
    def generate_interview_session_token(candidate_id, interview_id):
        payload = {
            "interview_id": interview_id,
            "candidate_id": candidate_id,
            'exp': int(time.time()) + 60 * 60 * 24 * 7
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")
