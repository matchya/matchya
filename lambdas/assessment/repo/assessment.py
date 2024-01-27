import os
import uuid

from client.postgres import PostgresDBClient
from entity.assessment import Assessment
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class AssessmentRepository:
    """
    This class is responsible for all the database operations
    """

    def __init__(self, db_client: PostgresDBClient):
        self.db_client = db_client

    def insert(self, company_id: str, assessment: Assessment):
        """
        Creates a new assessment record.

        :param body: The request body containing assessment data.
        :return: The assessment id.
        """
        logger.info(f'insert: {company_id}, {assessment}')
        assessment_id = str(uuid.uuid4())
        sql = """
            INSERT INTO assessment (id, company_id, name, position_type, position_level)
            VALUES ('%s', '%s', '%s', '%s', '%s');
            """ % (assessment_id, company_id, assessment.name, assessment.position_type, assessment.position_level)
        self.db_client.execute(sql)
        return assessment_id

    def retrieve_by_company_id(self, company_id):
        """
        Retrieves assessments from the database.

        :param company_id: The company ID.
        """
        logger.info(f'retrieve_by_company_id: {company_id}')
        sql = """
            SELECT 
                t.id, t.name, t.position_type, t.position_level, t.updated_at,
                COUNT(i.candidate_id) AS num_candidates
            FROM 
                assessment t
            LEFT JOIN 
                interview i ON t.id = i.assessment_id
            WHERE 
                t.company_id = '%s'
            GROUP BY 
                t.id, t.name, t.position_type, t.position_level, t.updated_at;
        """ % company_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            assessments = []
            for row in result:
                assessment = {
                    'id': row[0],
                    'name': row[1],
                    'position_type': row[2],
                    'position_level': row[3],
                    'updated_at': str(row[4]),
                    'num_candidates': row[5]
                }
                assessments.append(assessment)
            return assessments
        except Exception as e:
            logger.error(f'Failed to retrieve assessments from db: {e}')
            raise RuntimeError('Failed to retrieve assessments from db.')

    def retrieve_by_id(self, company_id, assessment_id):
        """
        Retrieves a assessment by assessment id from the database.

        :param company_id: The company ID.
        :param assessment_id: The assessment ID.
        """
        logger.info(f'retrieve_by_id: {company_id}, {assessment_id}')
        sql = """
            SELECT 
                assessment.id, assessment.name, assessment.position_type, assessment.position_level, assessment.created_at, 
                question.id, question.text, question.topic, question.difficulty,
                candidate.id, candidate.name, candidate.email,
                interview.status, interview.total_score
            FROM assessment
            LEFT JOIN assessment_question ON assessment.id = assessment_question.assessment_id
            LEFT JOIN question ON assessment_question.question_id = question.id
            LEFT JOIN assessment_candidate ON assessment.id = assessment_candidate.assessment_id
            LEFT JOIN candidate ON assessment_candidate.candidate_id = candidate.id
            LEFT JOIN interview ON interview.assessment_id = assessment.id AND interview.candidate_id = candidate.id
            WHERE assessment.company_id = '%s' AND assessment.id = '%s'
        """ % (company_id, assessment_id)
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            assessment = self._process_sql_result(result)
            return assessment
        except Exception as e:
            logger.error(f'Failed to retrieve a assessment by assessment id from db: {e}')
            raise RuntimeError('Failed to retrieve a assessment by assessment id from db.')

    def _process_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        """
        logger.info(f'_process_sql_result: {result}')
        if not result:
            raise ValueError('assessment not found.')
        assessment = {
            'id': result[0][0],
            'name': result[0][1],
            'position_type': result[0][2],
            'position_level': result[0][3],
            'created_at': str(result[0][4]),
            'questions': [],
            'candidates': []
        }
        questions = {}
        candidates = {}
        for row in result:
            (question_id, question_text, question_topic, question_difficulty,
             candidate_id, candidate_name, email, status, total_score) = row[5:]
            if question_id and question_id not in questions:
                question = {
                    'id': question_id,
                    'text': question_text,
                    'topic': question_topic,
                    'difficulty': question_difficulty
                }
                questions[question_id] = question

            if candidate_id and candidate_id not in candidates:
                candidate = {
                    'id': candidate_id,
                    'name': candidate_name,
                    'email': email,
                    'assessment': {
                        'interview_status': status,
                        'total_score': total_score
                    }
                }
                candidates[candidate_id] = candidate

        assessment['questions'] = list(questions.values())
        assessment['candidates'] = list(candidates.values())
        return assessment
