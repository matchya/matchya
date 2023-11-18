def authorize(event, context):
    print("EVENT: ", event)
    token = event['authorizationToken']

    is_valid = validate_token(token)

    if is_valid:
        return generate_policy('user', 'Allow', event['methodArn'])
    else:
        return generate_policy('user', 'Deny', event['methodArn'])


def validate_token(token):
    # TODO: will want to update this to a access token unique to the company
    return token == "Bearer validToken"


def generate_policy(principal_id, effect, resource):
    auth_response = {}
    auth_response['principalId'] = principal_id
    if effect and resource:
        policy_document = {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resource
            }]
        }
        auth_response['policyDocument'] = policy_document
    return auth_response
