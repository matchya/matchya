import os

from repo.answer import AnswerRepository
from repo.assessment import AssessmentRepository
from lambdas.interview.repo.quiz import QuizRepository
from client.open_ai import AudioTranscriber, EvaluationGenerator
from client.postgres import PostgresDBClient
from client.s3 import S3Client
from client.sentry import SentryClient
from utils.logger import Logger
from utils.package_info import PackageInfo
from utils.request_parser import RequestParser
from utils.response_generator import ResponseGenerator
from utils.video_processor import VideoProcessor


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))

SentryClient.initialize(PackageInfo('package.json').get_version())
evaluation_generator = EvaluationGenerator()
audio_processor = AudioTranscriber()
postgres_client = PostgresDBClient()
s3_client = S3Client()
response_generator = ResponseGenerator()
video_processor = VideoProcessor()


def handler(event, context):
    """
    Frontend uploads the audio file to S3.
    S3 triggers this lambda function.
    """
    logger.info("Starting lambda execution")
    try:
        # initialize the parser
        parser = RequestParser(event)

        # parsing from the event
        bucket, key = parser.parse_bucket_name_and_key()

        # business logic
        file_structure = key.split('/')  # ['environment', 'response_recording', 'webm', 'interview_id', 'question_id.webm']
        interview_id, question_id = file_structure[3], file_structure[4].split('.')[0]
        VIDEO_EXTENSION = '.' + file_structure[4].split('.')[1]
        video_file_path = s3_client.download_video_file_from_s3(bucket, key, file_name=interview_id + '_' + question_id + VIDEO_EXTENSION)
        audio_file_path = video_processor.extract_audio_from_video(video_file_path)
        transcript = audio_processor.transcript_from_audio(audio_file_path)

        with postgres_client as db_client:
            answer_repo = AnswerRepository(db_client)
            assessment_repo = AssessmentRepository(db_client)
            quiz_repo = QuizRepository(db_client)
            position_type, position_level = assessment_repo.get_position_type_and_level(interview_id)
            quiz = quiz_repo.get_quiz(question_id)
            score, feedback = evaluation_generator.generate(quiz, position_type, position_level, transcript)
            video_url = f'https://{bucket}.s3.amazonaws.com/{key}'
            answer_repo.store_answer_evaluation_to_db(interview_id, question_id, score, feedback, video_url)

        logger.info('Executing lambda function finished successfully')
    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Evaluating an answer failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Evaluating an answer failed (status {str(status_code)}): {e}')
