from http.cookies import SimpleCookie
import jwt

from config import Config


def handler(event, context):
    headers = event.get('headers', {})
    cookie_header = headers.get('Cookie', '')
    cookie = SimpleCookie(cookie_header)
    jwt_token = cookie['t'].value if 't' in cookie else None

    # TODO: implement logic to validate if jwt token is still valid

    if jwt_token:
        try:
            decoded_payload = jwt.decode(jwt_token, Config.JWT_SECRET_KEY, algorithms=["HS256"])

            return generate_policy('user', 'Allow', event['methodArn'], context=decoded_payload)
        except jwt.ExpiredSignatureError:
            return generate_policy('user', 'Deny', event['methodArn'], decoded_payload)
        except jwt.InvalidTokenError:
            return generate_policy('user', 'Deny', event['methodArn'], decoded_payload)


def generate_policy(principal_id, effect, resource, context=None):
    auth_response = {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resource
            }]
        }
    }

    if context:
        auth_response['context'] = context

    return auth_response
