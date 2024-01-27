
import os
from typing import List

import boto3
from botocore.exceptions import ClientError

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class SESClient:
    def __init__(self):
        self.client = boto3.client('ses')

    def send_email(self, sender, destinations: List[str], body_html_content: str, body_text_content: str, subject: str) -> str:
        logger.info(f'Sending email to {destinations}')
        try:
            response = self.client.send_email(
                Destination={
                    'ToAddresses': destinations,
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'UTF-8',
                            'Data': """
                                <html>
                                    <head></head>
                                    <body>
                                        %s
                                    </body>
                                </html>
                            """ % body_html_content,
                        },
                        'Text': {
                            'Charset': 'UTF-8',
                            'Data': body_text_content,
                        },
                    },
                    'Subject': {
                        'Charset': 'UTF-8',
                        'Data': subject,
                    },
                },
                Source=sender,
                # If you are not using a configuration set, comment or delete the
                # following line
                # ConfigurationSetName=CONFIGURATION_SET,
            )
            return response['MessageId']
        except ClientError as e:
            print(f"Error: {e.response['Error']['Message']}")
