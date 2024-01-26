import os

import boto3
from botocore.exceptions import ClientError

from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("You received an invitation to Matchya Assessment from [Company Name] Take the assessment now: https://www.matchya.ai")

# The subject line for the email.
SUBJECT = "You received an invitation to Matchya Assessment from [Company Name]"


# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
SENDER = "admin@matchya.ai"


# Specify a configuration set. If you do not want to use a configuration
# set, comment the following variable, and the
# ConfigurationSetName=CONFIGURATION_SET argument below.
CONFIGURATION_SET = "ConfigSet"


def get_body_html(interview_id):
    # interview_link = f"https://www.matchya.ai/interviews/{interview_id}/record"
    interview_link = f"http://127.0.0.1:5173/interviews/{interview_id}/record"
    body = """
        <html>
            <head></head>
            <body>
                <h1>You received an invitation to Matchya Assessment from [Company Name]</h1>
                <p>Click this link to start the assessment: 
                    <a href='%s'>Take the assessment now</a>
                </p>
                <p>(Test email... link is not working yet)</p>
            </body>
        </html>
    """ % interview_link
    return body


def send_email(candidate_email, interview_id):
    logger.info(f'send_email: {candidate_email}, {interview_id}')
    CHARSET = "UTF-8"
    client = boto3.client('ses')
    print(f"Sending email to {candidate_email} from {SENDER}")

    BODY_HTML = get_body_html(interview_id)
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    candidate_email,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
        # Display an error if something goes wrong.
    except ClientError as e:
        print(f"Error: {e.response['Error']['Message']}")
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
