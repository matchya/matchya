
import os
import uuid
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class AnswerRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def get_candidate_answers(self, interview_id):
        """
        Retrieves the candidate answers from the database.

        :param interview_id: The interview ID.
        """
        logger.info(f'Retrieving candidate answers from db by interview ID: {interview_id}...')
        sql = """
            SELECT 
                answer.id, answer.score, answer.feedback,
                quiz.context, quiz.id,
                question.text
            FROM answer
            LEFT JOIN interview ON answer.interview_id = interview.id
            LEFT JOIN quiz ON answer.quiz_id = quiz.id
            LEFT JOIN question ON quiz.id = question.quiz_id
            WHERE interview.id = '%s'
        """ % interview_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            answers = {}
            for row in result:
                if row[0] not in answers:
                    answer = {
                        'id': row[0],
                        'score': row[1],
                        'feedback': row[2],
                        'context': row[3],
                        'quiz_id': row[4],
                        'questions': []
                    }
                    answers[answer['id']] = answer
                answers[row[0]]['questions'].append(row[5])
            logger.info(f'Successfully retrieved candidate answers from db: {answers}')
            return list(answers.values())
        except Exception as e:
            logger.error(f'Failed to retrieve candidate answers from db: {e}')
            raise RuntimeError('Failed to retrieve candidate answers from db.')

    def store_answer_evaluation_to_db(self, interview_id, quiz_id, score, feedback, video_url):
        """
        Stores the answer evaluation to the database.

        :param interview_id: The interview id.
        :param quiz_id: The quiz id.
        :param score: The score.
        :param feedback: The feedback.
        :param video_url: The video url.
        """
        logger.info('Storing the answer evaluation to db...')
        # if answer is stored already, do nothing
        sql = """
            SELECT id FROM answer
            WHERE answer.interview_id = '%s' AND answer.quiz_id = '%s'
        """ % (interview_id, quiz_id)
        self.db_client.execute(sql)
        result = self.db_client.fetchall()
        if result:
            return

        feedback = feedback.replace("'", "''")
        sql = """
            INSERT INTO answer (id, interview_id, quiz_id, score, feedback, video_url)
            VALUES ('%s', '%s', '%s', '%s', '%s', '%s');
        """ % (str(uuid.uuid4()), interview_id, quiz_id, score, feedback, video_url)
        try:
            self.db_client.execute(sql)
        except Exception as e:
            logger.error(f'Failed to store the answer evaluation to db: {e}')
            raise RuntimeError('Failed to store the answer evaluation to db.')
