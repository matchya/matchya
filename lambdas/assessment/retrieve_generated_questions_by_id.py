# import os
# from typing import List

# from client.postgres import PostgresDBClient
# from client.sentry import SentryClient
# from lambdas.assessment.entity.quiz import Question
# from lambdas.assessment.repo.quiz import QuestionRepository
# from utils.logger import Logger
# from utils.package_info import PackageInfo
# from utils.request_parser import RequestParser
# from utils.response_generator import ResponseGenerator

# logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

# SentryClient.initialize(PackageInfo('package.json').get_version())
# postgres_client = PostgresDBClient()
# response_generator = ResponseGenerator()


# def handler(event, context):
#     """
#     This function is used for polling from the frontend to retrieve the questions for a given assessment.
#     If the assessment was being generated properly, the questions will be returned.
#     """
#     try:
#         logger.info('Retrieving assessments...')

#         # parsing from the event
#         request_parser = RequestParser(event)
#         origin = request_parser.parse_header()
#         assessment_id = request_parser.parse_request_parameter('id')
#         response_generator.origin_domain = origin

#         # db operations
#         with postgres_client as db_client:
#             question_repo = QuestionRepository(db_client)
#             questions: List[Question] = question_repo.retrieve_many_by_assessment_id(assessment_id)
#         return response_generator.generate_success_response({
#             'questions': [question.to_dict() for question in questions]
#         })
#     except (ValueError, RuntimeError, Exception) as e:
#         error_code = 400 if isinstance(e, (ValueError, RuntimeError)) else 500
#         logger.error(f'Retrieving an assessment failed: {e}')
#         return response_generator.generate_error_response(error_code, str(e))
