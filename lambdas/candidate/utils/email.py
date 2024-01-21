import boto3
from botocore.exceptions import ClientError

# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>You received an invitation to Matchya Assessment from [Company Name]</h1>
  <p>Click this link to start the assessment: 
    <a href='https://www.matchya.ai'>Take the assessment now</a>
</p>
<p>(Test email... link is not working yet)</p>
</body>
</html>
            """

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


def send_email(candidate_email):
    CHARSET = "UTF-8"
    client = boto3.client('ses')
    print(f"Sending email to {candidate_email} from {SENDER}")
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
