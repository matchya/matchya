
import os
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuizRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def get_quiz(self, quiz_id):
        """
        Gets a quiz by quiz id from the database.

        :param quiz_id: The quiz id.
        """
        logger.info('Getting a quiz by quiz id from db...')
        sql = """
            SELECT 
                quiz.id, quiz.context, quiz.topic, quiz.subtopic, quiz.difficulty,
                metric.name, metric.scoring, metric.weight
            FROM quiz
            LEFT JOIN metric ON quiz.id = metric.quiz_id
            WHERE quiz.id = '%s'
        """ % quiz_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            question = self._process_sql_result(result)
            return question
        except Exception as e:
            logger.error(f'Failed to get a quiz by quiz id from db: {e}')
            raise RuntimeError('Failed to get a quiz by quiz id from db.')

    def _process_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        """
        if not result:
            raise ValueError('Quiz not found.')
        quiz = {
            'id': result[0][0],
            'context': result[0][1],
            'topic': result[0][2],
            'subtopic': result[0][3],
            'difficulty': result[0][4],
            'metrics': []
        }
        metrics = {}
        for row in result:
            (metric_name, metric_scoring, metric_weight) = row[4:]
            if metric_name not in metrics:
                metric = {
                    'name': metric_name,
                    'scoring': metric_scoring,
                    'weight': metric_weight
                }
                metrics[metric_name] = metric
                quiz['metrics'].append(metric)
        return quiz
