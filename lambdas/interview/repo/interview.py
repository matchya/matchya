import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class InterviewRepository:
    def __init__(self, db_client):
        self.db_client = db_client
        logger.info('InterviewRepository initialized.')

    def retrieve_by_assessment_candidate_ids(self, assessment_id, candidate_id):
        """
        Retrieves the interview ID from the database.

        :param assessment_id: The assessment ID.
        :param candidate_id: The candidate ID.
        """
        logger.info('Retrieving interview ID from db...')
        sql = """
            SELECT id
            FROM interview
            WHERE assessment_id = '%s' AND candidate_id = '%s'
        """ % (assessment_id, candidate_id)
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchone()
            return result[0]
        except Exception as e:
            logger.error(f'Failed to retrieve interview ID from db: {e}')
            raise RuntimeError('Failed to retrieve interview ID from db, candidate might not have started the assessment.')

    def update_interview(self, interview_id, total_score, summary):
        """
        Saves the interivew result to the database.

        :param interview_id: The interview ID.
        :param total_score: The total score.
        :param summary: The summary.
        """
        logger.info(f'Updating interview to db by interview ID: {interview_id}...')
        summary = summary.replace("'", "''")
        sql = """
            UPDATE interview
            SET total_score = %s, summary = %s, status = 'COMPLETED'
            WHERE id = %s
        """
        try:
            self.db_client.execute(sql, (total_score, summary, interview_id))
        except Exception as e:
            logger.error(f'Failed to update interview result to db: {e}')
            raise RuntimeError('Failed to update interview result to db.')

    def retrieve_interview_quizzes_by_id(self, interview_id):
        """
        Retrieves a interview quizzes by interview id from the database.

        :param interview_id: The interview ID.
        :return: The interview data.
        """
        logger.info('Retrieving a interview quizzes by interview id from db...')
        sql = """  
            SELECT
                i.id, i.created_at,
                a.id, a.name,
                c.id, c.name, c.email,
                quiz.id, quiz.context,
                question.id, question.text, question.question_number
            FROM interview i
            LEFT JOIN assessment a ON a.id = i.assessment_id
            LEFT JOIN candidate c ON c.id = i.candidate_id
            LEFT JOIN assessment_quiz aq ON aq.assessment_id = a.id
            LEFT JOIN quiz ON quiz.id = aq.quiz_id
            LEFT JOIN question ON question.quiz_id = quiz.id
            WHERE i.id = '%s' AND i.status != 'COMPLETED';
        """ % interview_id
        logger.info(f'Retrieving candidate interview quizzes: {interview_id}')
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            processed_result = self._process_interview_quizes_sql_result(result)
            logger.info(f'Successfully retrieved candidate interview quizzes: {processed_result}')
            return processed_result
        except Exception as e:
            logger.error(f'Retrieving a interview quizzes by interview id from db failed: {e}')
            raise RuntimeError('Failed to retrieve a interview quizzes by interview id from db.')

    def _process_interview_quizes_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        :return: The processed result.
        """

        if not result:
            raise ValueError('Interview not found.')

        interview = {
            'id': result[0][0],
            'created_at': str(result[0][1]),
            'assessment': {
                'id': result[0][2],
                'name': result[0][3],
            },
            'candidate': {
                'id': result[0][4],
                'name': result[0][5],
                'email': result[0][6],
            },
            'quizzes': [],
        }
        quizzes = {}
        for row in result:
            (quiz_id, quiz_context, question_id, question_text, question_number) = row[7:]
            if quiz_id and quiz_id not in quizzes:
                quizzes[quiz_id] = {
                    'id': quiz_id,
                    'context': quiz_context,
                    'questions': {},
                }

            if question_id and question_id not in quizzes[quiz_id]['questions']:
                question = {
                    'id': question_id,
                    'text': question_text,
                    'question_number': question_number,
                }
                quizzes[quiz_id]['questions'][question_id] = question

        for quiz_id in quizzes:
            quizzes[quiz_id]['questions'] = list(quizzes[quiz_id]['questions'].values())
            interview['quizzes'].append(quizzes[quiz_id])
        return interview

    def retrieve_interview_results_by_id(self, interview_id):
        """
        Retrieves a interview results by interview id from the database.

        :param interview_id: The interview ID.
        :return: The interview data.
        """
        logger.info('Retrieving a interview results by interview id from db...')
        sql = """
            WITH avg_scores AS (
                SELECT
                    quiz_id,
                    AVG(score) AS avg_quiz_score
                FROM answer
                GROUP BY quiz_id
            ),
            assessment_scores AS (
                SELECT
                    assessment_id,
                    AVG(total_score) AS avg_assessment_score,
                    MAX(total_score) AS top_assessment_score
                FROM interview
                WHERE status = 'COMPLETED'
                GROUP BY assessment_id
            )
            SELECT
                i.id, 
                i.total_score, 
                i.summary, 
                i.created_at,
                c.id AS candidate_id, 
                c.name AS candidate_name, 
                c.email,
                a.id AS assessment_id, 
                a.name AS assessment_name,
                ass_scores.avg_assessment_score,
                ass_scores.top_assessment_score,
                q.id AS quiz_id, 
                q.description, 
                q.topic, 
                q.subtopic, 
                q.difficulty, 
                ans.video_url, 
                ans.feedback, 
                ans.score,
                as_avg.avg_quiz_score
            FROM interview i
            LEFT JOIN assessment a ON a.id = i.assessment_id
            LEFT JOIN candidate c ON c.id = i.candidate_id
            LEFT JOIN assessment_quiz aq ON aq.assessment_id = a.id
            LEFT JOIN quiz q ON q.id = aq.quiz_id
            LEFT JOIN answer ans ON ans.quiz_id = q.id AND ans.interview_id = i.id
            LEFT JOIN avg_scores as_avg ON as_avg.quiz_id = q.id
            LEFT JOIN assessment_scores ass_scores ON ass_scores.assessment_id = a.id
            WHERE i.id = '%s' AND i.status = 'COMPLETED';
        """ % interview_id
        try:
            self.db_client.execute(sql)
            result = self.db_client.fetchall()
            return self._retrieve_interview_results_by_id_process_sql_result(result)
        except Exception as e:
            logger.error(f'Retrieving a interview results by interview id from db failed: {e}')
            raise RuntimeError('Failed to retrieve a interview results by interview id from db.')

    def _retrieve_interview_results_by_id_process_sql_result(self, result):
        """
        Processes the SQL result.

        :param result: The SQL result.
        :return: The processed result.
        """

        if not result:
            raise ValueError('Interview results not found.')

        interview = {
            'id': result[0][0],
            'total_score': result[0][1],
            'summary': result[0][2],
            'created_at': str(result[0][3]),
            'candidate': {
                'id': result[0][4],
                'name': result[0][5],
                'email': result[0][6],
            },
            'assessment': {
                'id': result[0][7],
                'name': result[0][8],
                'average_score': result[0][9],
                'top_score': result[0][10],
            },
            'answers': [],
        }

        for row in result:
            (quiz_id, quiz_description, quiz_topic, quiz_subtopic, quiz_difficulty,
             video_url, feedback, score, avg_score) = row[11:]
            if quiz_id and video_url:
                answer = {
                    'quiz': {
                        'id': quiz_id,
                        'description': quiz_description,
                        'topic': quiz_topic,
                        'subtopic': quiz_subtopic,
                        'difficulty': quiz_difficulty,
                        'average_score': avg_score,
                    },
                    'video_url': video_url,
                    'feedback': feedback,
                    'score': score
                }
                interview['answers'].append(answer)

        return interview

    def retrieve_interviews(self, company_id):
        """
        Retrieves interviews from the database.

        :param company_id: The id of the company.
        :return: The interviews.
        """
        logger.info("Retrieving interviews...")
        sql = """
            SELECT
                i.id AS interview_id, i.total_score AS interview_total_score, i.created_at AS interview_created_at,
                c.id AS candidate_id, c.name AS candidate_name,
                a.id AS assessment_id, a.name AS assessment_name
            FROM interview AS i
            LEFT JOIN candidate AS c ON c.id = i.candidate_id
            LEFT JOIN assessment AS a ON a.id = i.assessment_id
            WHERE a.company_id = '%s' AND i.status = 'COMPLETED' AND a.deleted_at IS NULL;
        """ % company_id
        self.db_client.execute(sql)
        result = self.db_client.fetchall()
        interviews = self._retrieve_interviews_process_sql_result(result)
        return interviews

    def _retrieve_interviews_process_sql_result(self, result):
        """
        Processes the SQL result and returns a list of interviews.

        :param result: The SQL result.
        :return: A list of interviews.
        """
        logger.info("Processing the SQL result...")
        interviews = {}
        for row in result:
            (interview_id, interview_total_score, interview_created_at,
             candidate_id, candidate_name,
             assessment_id, assessment_name) = row

            if interview_id and interview_id not in interviews:
                interviews[interview_id] = {
                    'id': interview_id,
                    'total_score': interview_total_score,
                    'created_at': str(interview_created_at),
                    'candidate': {
                        'id': candidate_id,
                        'name': candidate_name
                    },
                }
                if assessment_id:
                    interviews[interview_id]['assessment'] = {
                        'id': assessment_id,
                        'name': assessment_name
                    }
        return list(interviews.values())
