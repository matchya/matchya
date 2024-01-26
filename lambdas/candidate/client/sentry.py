import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from config import Config
from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class SentryClient:
    @staticmethod
    def initialize(version):
        if Config.SENTRY_DSN:
            logger.info(f"initialize: {version}")
            sentry_sdk.init(
                dsn=Config.SENTRY_DSN,
                environment=Config.ENVIRONMENT,
                integrations=[AwsLambdaIntegration(timeout_warning=True)],
                release=f'assessment@{version}',
                traces_sample_rate=0.5,
                profiles_sample_rate=1.0,
            )
