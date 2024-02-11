# import json
# import os

# import boto3

# from entity.assessment import Assessment
# from utils.logger import Logger

# logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


# class SqsClient:
#     def __init__(self, queue_url):
#         self.client = boto3.client('sqs')
#         self.queue_url = queue_url

#     def _send_message(self, message_body):
#         logger.info(f"_send_message: {message_body}")
#         response = self.client.send_message(
#             QueueUrl=self.queue_url,
#             MessageBody=json.dumps(message_body)
#         )
#         if response.get('MessageId') is None:
#             error_message = "Send message failed"
#             logger.exception(error_message)
#             raise RuntimeError(error_message)

#     def publish_questions(self, assessment: Assessment):
#         logger.info(f"publish_quizes: {assessment}")
#         message_body = {
#             'assessment_id': assessment.id,
#             'position_type': assessment.position_type,
#             'position_level': assessment.position_level,
#             'topics': assessment.topics
#         }
#         self._send_message(message_body=message_body)
