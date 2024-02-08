import os

import boto3

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class S3Client:
    def __init__(self):
        self.client = boto3.resource('s3')

    def download_video_file_from_s3(self, bucket, key, file_name):
        """
        Downloads a file from S3.

        :param bucket: The bucket name.
        :param key: The key.
        """
        logger.info(f'Downloading {key} from {bucket}...')
        local_file_name = '/tmp/' + file_name
        self.client.Bucket(bucket).download_file(key, local_file_name)
        return local_file_name
