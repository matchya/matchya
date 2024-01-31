import os
import boto3
from botocore.exceptions import NoCredentialsError

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class S3Client:
    def __init__(self):
        self.client = boto3.client('s3')

    def retrieve_presigned_metadata_for_upload(self, interview_id, question_id):
        try:
            response = self.client.generate_presigned_post(
                Bucket=f'{Config.NAMESPACE}-{Config.ENVIRONMENT}-data-question-response-video',
                Key=f'{interview_id}/{question_id}.webm',
                ExpiresIn=3600
            )
            return response
        except NoCredentialsError as e:
            raise e
