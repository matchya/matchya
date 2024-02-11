import os

from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class IAMPolicyGenerator:
    def __init__(self, principal_id):
        self.principal_id = principal_id

    def generate_policy(self, effect, context=None):
        logger.info(f"Generating {effect} policy...")
        auth_response = {
            'principalId': self.principal_id,
            'policyDocument': {
                'Version': '2012-10-17',
                'Statement': [{
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': "*"
                }]
            }
        }

        if context:
            auth_response['context'] = context

        return auth_response
