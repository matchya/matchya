# import json
# import os

# from client.open_ai import OpenAiClient
# from client.postgres import PostgresDBClient
# from client.sentry import SentryClient
# from lambdas.assessment.repo.assessment_quiz import AssessmentQuestionRepository
# from lambdas.assessment.repo.quiz import QuestionRepository
# from repo.metric import MetricRepository
# from utils.logger import Logger
# from utils.package_info import PackageInfo
# from utils.topics import get_random_topics_by_position_type_and_level

# logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

# SentryClient.initialize(PackageInfo('package.json').get_version())
# postgres_client = PostgresDBClient()
# open_ai_client = OpenAiClient()


# def handler(event, context):
#     """
#     Creating a new assessment sends a message to the queue to generate questions.
#     """
#     logger.info(event)
#     try:
#         logger.info('Received generate questions request')

#         messages = event['Records']
#         body = json.loads(messages[0]['body'])
#         assessment_id = body.get('assessment_id')
#         position_type = body.get('position_type')
#         position_level = body.get('position_level')
#         topics = body.get('topics')

#         # business logic
#         NUM_QUESTIONS = 3
#         logger.info("Getting the keywords from the position type and level...")
#         keywords: list = get_random_topics_by_position_type_and_level(position_type, position_level, topics, NUM_QUESTIONS)
#         questions = open_ai_client.generate_questions(keywords, position_type, position_level)

#         # db operations
#         with postgres_client as db_client:
#             question_repo = QuestionRepository(db_client)
#             assessment_question_repo = AssessmentQuestionRepository(db_client)
#             metric_repo = MetricRepository(db_client)
#             question_repo.insert_many(questions)
#             assessment_question_repo.insert(assessment_id, questions)
#             metric_repo.insert_many(questions)

#     except (ValueError, RuntimeError) as e:
#         status_code = 400
#         logger.error(f'Questions generation failed (status {str(status_code)}): {e}')
#     except Exception as e:
#         status_code = 500
#         logger.error(f'Questions generation failed (status {str(status_code)}): {e}')
