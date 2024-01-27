
import os
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class QuestionRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def get_question(self, question_id):
        """
        Gets a question by question id from the database.

        :param question_id: The question id.
        """
        logger.info('Getting a question by question id from db...')
        sql = """
            SELECT 
                question.id, question.text, question.topic, question.difficulty,
                metric.name, metric.scoring, metric.weight
            FROM question
            LEFT JOIN metric ON question.id = metric.question_id
            WHERE question.id = '%s'
        """ % question_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            question = self._process_sql_result(result)
            return question
        except Exception as e:
            logger.error(f'Failed to get a question by question id from db: {e}')
            raise RuntimeError('Failed to get a question by question id from db.')

    def _process_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        """
        if not result:
            raise ValueError('Question not found.')
        question = {
            'id': result[0][0],
            'text': result[0][1],
            'topic': result[0][2],
            'difficulty': result[0][3],
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
                question['metrics'].append(metric)
        return question
