import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class SentryClient:
    @staticmethod
    def initialize(version):
        if Config.SENTRY_DSN:
            logger.info(f"initialize: {version}")
            sentry_sdk.init(
                dsn=Config.SENTRY_DSN,
                environment=Config.ENVIRONMENT,
                integrations=[AwsLambdaIntegration(timeout_warning=True)],
                release=f'{Config.SERVICE_NAME}@{version}',
                traces_sample_rate=0.5,
                profiles_sample_rate=1.0,
            )
