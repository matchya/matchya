from abc import ABC, abstractmethod
import json
import os

from openai import OpenAI
from entity.quiz import Quiz
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class OpenAiClient(ABC):
    def __init__(self, model):
        self.client = OpenAI()
        self.model = model


class OpenAiChatClient(OpenAiClient):
    def __init__(self, model="gpt-3.5-turbo-1106", temperature=0.5):
        super().__init__(model)
        self.model = model
        self.temperature = temperature

    @abstractmethod
    def _get_system_and_user_message(self, answers):
        pass


class QuizGenerator(OpenAiChatClient):
    def _get_system_and_user_message(self, topic, difficulty, position_type, position_level, position_description):
        """
        Generates the system and user message for GPT.

        :param topic: The topic.
        :param difficulty: The difficulty.
        :param position_type: The position type.
        :param position_level: The position level.
        :param position_description: The position description.
        """
        logger.info('Generating system and user message for GPT...')
        system_message = """
            You are tasked with generating a quiz to evaluate candidates for a position.
            You will be provided with the 'topic', 'difficulty', 'position type', 'position level', and 'position description'.
            Based on the information provided, you must generate a quiz that evaluates the candidate's expertise and problem-solving skills in the given topic and difficulty.
            1. You should reexamine the topic given by the user. The topic must be the main subject of the quiz and it shouldn't be too broad or too narrow.
            2  You must use the same difficulty level as the one provided by the user.
            3. You choose the subtopic and the questions that will be part of the quiz. For example, if the topic is "AWS" and the difficulty is "Medium", you can choose "Cost optimization", "Security", "Reliability", etc. as subtopics. When choosing the subtopic, consider position description and level.
            4. You write a description of the quiz. The description should explain the purpose of the quiz and the skills that will be evaluated. 
            5. You write the context of the quiz. The context should explain the situation and the problem that the candidate will have to solve.
            6. You write three questions for the quiz. Each question should be related to the subtopic and the difficulty level. The questions should be clear, concise, and should evaluate the candidate's knowledge and problem-solving skills.
            7. You write the criteria for each question. The criteria should explain how the candidate's answer will be evaluated and how many points the candidate can get for each question.
            8. You write additional criteria for the quiz. The additional criteria should explain how the candidate's answers will be evaluated and how many additional points the candidate can get.
            9. You write the maximum score for the quiz. The maximum score should be the sum of the points for each question and the additional criteria.
            
            - The context should be a brief description of the situation and it should align with the difficulty level.
            - The three questions should have different levels: Basic, Intermediate, and Advanced. The questions should be related to the subtopic and the difficulty level.
            - If the difficulty level is "Easy", the questions should be basic and should evaluate the candidate's foundational knowledge.
            - If the difficulty level is "Medium", the questions should be intermediate and should evaluate the candidate's expertise and problem-solving skills.
            - If the difficulty level is "Hard", the questions should be advanced and should evaluate the candidate's expertise and problem-solving skills in depth.
            
            Your response is expected to be this json format, I will give you two examples. But you only need to return one:
            1. {
                "context": "You are a junior backend engineer starting to work with Python for developing web APIs. Your tasks involve creating simple yet efficient APIs for web applications that communicate with databases and other web services. You need to ensure your APIs are well-structured, follow best practices, and are maintainable over time.",
                "topic": "Python",
                "subtopic": "API Development",
                "difficulty": "Easy",
                "description": "This quiz evaluates the candidate's foundational knowledge in developing APIs with Python, covering basics such as HTTP methods, status codes, RESTful principles, and the use of popular Python frameworks for API development.",
                "questions": [
                    {
                        "level": "Basic",
                        "text": "What are the common HTTP methods used in RESTful API development, and what is the primary purpose of each?",
                        "criteria": "1 Point: Lists one or two HTTP methods without describing their purposes. \
                                    2 Points: Lists most common HTTP methods (GET, POST, PUT, DELETE) with a brief description of their purpose. \
                                    3 Points: Provides a detailed description of the purpose of GET, POST, PUT, and DELETE methods in the context of RESTful APIs. \
                                    Total Possible Points: 3"
                    },
                    {
                        "level": "Intermediate",
                        "text": "Explain what a status code is in the context of HTTP responses and name three common status codes along with their meanings.",
                        "criteria": "1 Point: Provides a basic definition of what a status code is without naming any specific codes. \
                                    2 Points: Names three common status codes (e.g., 200 OK, 404 Not Found, 500 Internal Server Error) with a brief explanation of their meanings. \
                                    3 Points: Offers a comprehensive explanation of what status codes are and provides detailed meanings for at least three common status codes. \
                                    Total Possible Points: 3"
                    },
                    {
                        "level": "Advanced",
                        "text": "Describe the Flask framework and its use in Python API development.",
                        "criteria": "1 Point: Mentions that Flask is a Python framework without further detail. \
                                    2 Points: Describes Flask as a micro web framework for Python and briefly mentions its use in API development. \
                                    3 Points: Provides a detailed description of Flask, including its lightweight nature, ease of use for creating web applications and APIs, and its extensibility with extensions. \
                                    Total Possible Points: 3"
                    }
                ],
                "additional_criteria": "Consistency: The response is logically structured and consistently focuses on the question's key aspects (up to 1 additional point). \
                                        Examples: Provides real-world examples or hypothetical scenarios to illustrate points (up to 1 additional point). \
                                        Clarity and Depth: The answer is clear, well-articulated, and demonstrates depth of understanding regarding Python API development basics (up to 1 additional point). \
                                        Total Possible Additional Points: 3",
                "max_score": 12
            }

            2. {
                "context": "You are a cloud engineer responsible for optimizing the cost of an AWS infrastructure supporting a large-scale web application. The current architecture involves multiple services, and there are concerns about unnecessary expenses. Your goal is to implement a cost optimization strategy for the AWS infrastructure while maintaining the application's performance and reliability.",
                "topic": "AWS",
                "subtopic": "Cost optimization",
                "difficulty": "Medium",
                "description": "This quiz evaluates the candidate's expertise and problem-solving skills in optimizing AWS infrastructure costs without compromising application performance and reliability, a frequent challenge for cloud engineers.",
                "questions" [
                    {
                        "level": "Basic",
                        "text": "What is the primary responsibility of a cloud engineer in the context of AWS cost optimization for a large-scale web application?",
                        "criteria": "1 Point: Mentions the concept of cost optimization in a general context. \
                                     2 Points: Identifies that the optimization pertains to AWS infrastructure. \
                                     3 Points: States the importance of minimizing costs while ensuring the application's performance and reliability. \
                                     4 Points: Highlights the need for regular review and management of AWS services to eliminate waste. \
                                     5 Points: Elaborates on implementing cost-effective scaling and selecting cost-efficient service options, alongside maintaining performance and reliability. \
                                     Total Possible Points: 5"
                    },
                    {
                        "level": "Intermediate",
                        "text": "Can you outline three specific cost optimization techniques or best practices that a cloud engineer might employ to reduce expenses in an AWS infrastructure supporting a complex web application?",
                        "criteria": "1 Point: For each technique mentioned in a general context without specificity to AWS or web applications. \
                                     2 Points: For each AWS-specific cost optimization technique identified, even if detail is minimal. \
                                     3 Points: For a detailed description of each technique, including its application to AWS and web applications. \
                                     +1 Bonus Point: For each technique, if the response includes an explanation of how it reduces costs or provides a specific example. \
                                     Total Possible Points: 9 (3 techniques × 3 points each, + 1 bonus point per technique for detail or examples)"
                    },
                    {
                        "level": "Advanced",
                        "text": When dealing with a multi-tiered AWS architecture for a large-scale web application, discuss the trade-offs and considerations involved in implementing spot instances versus reserved instances as part of a comprehensive cost optimization strategy.",
                        "criteria": "1-2 Points: Basic recognition of either Spot or Reserved Instances without detailed analysis.
                                     3-4 Points: Identifies both options with a superficial comparison.
                                     5-6 Points: Discusses detailed considerations for using Spot or Reserved Instances, including cost efficiency or flexibility.
                                     7-8 Points: Provides in-depth analysis on multiple aspects (cost efficiency, flexibility, operational complexity, financial commitment).
                                     9-10 Points: Offers a comprehensive evaluation, including all mentioned aspects and suggesting a strategic approach based on application needs.
                                     Bonus Points for Advanced Level Question:

                                     +1 Point: For consistency in the response.
                                     +1 Point: For each real-world example or hypothetical scenario provided.
                                     +1 Point: For demonstrating clear, well-articulated responses that show depth of understanding.
                                     Total Possible Points for Advanced Level Question: 13 (basic score 10 + bonus points 3)"
                    }
                ],
                "additional_criteria": "Consistency: The response is logically structured and consistently focuses on the question's key aspects (up to 2 additional points). \
                                        Examples: Provides real-world examples or hypothetical scenarios to illustrate points (up to 2 additional points). \
                                        Clarity and Depth: The answer is clear, well-articulated, and demonstrates depth of understanding regarding AWS cost optimization strategies (up to 2 additional points). \
                                        Total Possible Additional Points: 6",
                "max_score":  33
            }
            
            3. {
                "context": "You are a senior backend engineer tasked with designing, deploying, and managing a scalable and efficient microservices architecture for a large-scale web application. The current architecture involves multiple services, and there are concerns about complexity, inter-service communication, and maintaining high availability. Your goal is to implement a strategy that ensures the microservices architecture is scalable, resilient, and maintainable, while also facilitating continuous integration and delivery.",
                "topic": "Microservices",
                "subtopic": "Architecture design and management",
                "difficulty": "Hard",
                "description": "This quiz evaluates the candidate's expertise and problem-solving skills in designing, deploying, and managing a microservices architecture for a large-scale web application, addressing challenges like service decomposition, inter-service communication, and ensuring high availability.",
                "questions": [
                    {
                        "level": "Basic",
                        "text": "What are the key principles behind microservices architecture that support its scalability and resilience?",
                        "criteria": "1 Point: Mentions the basic idea of microservices being independently deployable. \
                                    2 Points: Identifies that microservices allow for language-agnostic development. \
                                    3 Points: Highlights the importance of decentralized data management. \
                                    4 Points: Discusses the principle of fault isolation and its impact on resilience. \
                                    5 Points: Elaborates on automated deployment and the use of APIs for service communication as central to scalability and resilience. \
                                    Total Possible Points: 5"
                    },
                    {
                        "level": "Intermediate",
                        "text": "How would you address the challenge of inter-service communication in a microservices architecture, ensuring efficiency and reliability?",
                        "criteria": "1 Point: For mentioning a generic communication protocol without application to microservices. \
                                    2 Points: For identifying REST or messaging queues as communication strategies. \
                                    3 Points: For a detailed description of synchronous (e.g., REST) vs. asynchronous (e.g., messaging queues) communication, including their application to microservices. \
                                    +1 Bonus Point: For each strategy, if the response includes an explanation of how it ensures efficiency or reliability or provides a specific example. \
                                    Total Possible Points: 7 (2 strategies × 3 points each, + 1 bonus point per strategy for detail or examples)"
                    },
                    {
                        "level": "Advanced",
                        "text": "Discuss the impact of service granularity on the performance and maintainability of a microservices architecture.",
                        "criteria": "1-2 Points: Basic recognition of the concept of service granularity without detailed analysis. \
                                    3-4 Points: Identifies the balance between too fine-grained and too coarse-grained services with a superficial comparison. \
                                    5-6 Points: Discusses detailed considerations for determining the right level of service granularity, including performance and maintainability impacts. \
                                    7-8 Points: Provides in-depth analysis on multiple aspects of service granularity, including the trade-offs in inter-service communication, database design, and deployment complexities. \
                                    9-10 Points: Offers a comprehensive evaluation, including all mentioned aspects and suggesting a strategic approach based on application needs and domain-driven design principles. \
                                    Bonus Points for Advanced Level Question: \
                                    +1 Point: For consistency in the response. \
                                    +1 Point: For each real-world example or hypothetical scenario provided. \
                                    +1 Point: For demonstrating clear, well-articulated responses that show depth of understanding. \
                                    Total Possible Points for Advanced Level Question: 13 (basic score 10 + bonus points 3)"
                    }
                ],
                "additional_criteria": "Consistency: The response is logically structured and consistently focuses on the question's key aspects (up to 2 additional points). \
                                        Examples: Provides real-world examples or hypothetical scenarios to illustrate points (up to 2 additional points). \
                                        Clarity and Depth: The answer is clear, well-articulated, and demonstrates depth of understanding regarding microservices design, deployment, and management (up to 2 additional points). \
                                        Total Possible Additional Points: 6",
                "max_score": 31
            }
        """

        user_message = f'Generate a quiz for the position type {position_type} and position level {position_level}.\n'
        user_message += f'Topic: {topic}\n'
        user_message += f'Difficulty: {difficulty}\n'
        user_message += f'Position description: {position_description}\n'
        return system_message, user_message

    def generate(self, topic, difficulty, position_type, position_level, position_description) -> Quiz:
        """
        Generates a quiz for a position.

        :param topic: The topic.
        :param difficulty: The difficulty.
        :param position_type: The position type.
        :param position_level: The position level.
        :param position_description: The position description.
        """
        logger.info('Generating quiz from GPT...')
        try:
            system_message, user_message = self._get_system_and_user_message(topic, difficulty, position_type, position_level, position_description)
            completion = self.client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.75
            )
            content = json.loads(completion.choices[0].message.content)
            logger.info(f"Generated quiz: {content}")
            quiz = Quiz()
            quiz.context = content['context']
            quiz.topic = content['topic']
            quiz.subtopic = content['subtopic']
            quiz.difficulty = content['difficulty']
            quiz.description = content['description']
            quiz.questions = content['questions']
            quiz.additional_criteria = content['additional_criteria']
            quiz.max_score = content['max_score']
            return quiz
        except Exception as e:
            logger.error(f'Failed to get the quiz from GPT: {e}')
            raise RuntimeError('Failed to get the quiz from GPT.')


class SummaryGenerator(OpenAiChatClient):
    def _get_system_and_user_message(self, answers):
        """
        Generates the system and user message for GPT.

        :param answers: The candidate answers.
        """
        logger.info('Generating system and user message for GPT...')
        system_message = """
        You are tasked to write a summary of the candidate's answers and give a final evaluation.
        You will be provided 'question', 'feedback' and 'score' for each answer.
        Feedback is an evaluation of the answer, and score is the score of the answer from 0 to 10. 10 being the best.
        Your summary should be 3-5 sentences long, describing the candidate's performance, strengths and weaknesses.
        Your response is expected to be this json format:
        {
            "summary": "The summary of the candidate's answers."
        }
        """

        user_message = 'Here is a list of the candidate answers: \n'
        for answer in answers:
            user_message += f'Question: {answer["question"]}\n'
            user_message += f'Feedback: {answer["feedback"]}\n'
            user_message += f'Score: {answer["score"]}\n\n'
        user_message += 'Please write a summary of the candidate\'s answers and give a final evaluation.'

        return system_message, user_message

    def generate(self, answers):
        """
        Generates a summary from the candidate answers.

        :param answers: The candidate answers.
        """
        logger.info('Generating summary from GPT...')
        try:
            system_message, user_message = self._get_system_and_user_message(answers)
            completion = self.client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.5
            )
            content = json.loads(completion.choices[0].message.content)
            logger.info(f"Summary: {content['summary']}")
            return content['summary']
        except Exception as e:
            logger.error(f'Failed to get the summary from GPT: {e}')
            raise RuntimeError('Failed to get the summary from GPT.')


class EvaluationGenerator(OpenAiChatClient):
    def _get_system_and_user_message(self, quiz, answer):
        """
        Gets the system and user messages.

        :param quiz: The quiz.
        :param position_type: The position type.
        :param position_level: The position level.
        """
        logger.info('Getting the system and user messages...')
        system_message = """
        You are tasked with evaluating a candidate's answer to a question.
        Question has id, context, topic, subtopic, difficulty, questions, and their criteria.
        Based on the information provided, you must evaluate the candidate's answer.

        You are going to give a score to the answer from 0 to 100, and feedback to the candidate.
        The score is calculated based on the criteria and the candidate's answer. Each question has a detailed criteria that explains how the candidate's answer will be evaluated and how many points the candidate can get for each question.
        Also, a quiz has additional criteria that explains how the candidate's answers will be evaluated and how many additional points the candidate can get.
        Your calculation should be based on the criteria and the candidate's answer. The sum of the all points divided by the maximum score of the quiz, multiplied by 100, will give you the score.
        For example, if the candidate gets 10 points out of 12, the score will be (10/12)*100 = 83.33.
        Calculate the score for each question first, then calculate the additional criteria, and then calculate the total score.
        
        Return the total score in json format with feedback.
        The feedback is calculated based on the score and what the candidate did well and what the candidate could improve.

        Your response should be a JSON object with the following fields:
        {
            "score": <score>, // 0 to 100 float number calculated based on the criteria
            "feedback": <feedback> // 2-3 sentences why you gave the score you gave
        }
        """

        user_message = f'Topic: {quiz["topic"]}\n'
        user_message += f'Subtopic: {quiz["subtopic"]}\n'
        user_message += f'Difficulty: {quiz["difficulty"]}\n'
        user_message += f'The total score for the quiz is {quiz["max_score"]}\n'
        user_message += f'Context: {quiz["context"]}\n'
        user_message += 'Questions:\n'
        for i in range(len(quiz['questions'])):
            question = quiz['questions'][i]
            user_message += f'Question {i + 1}. {question["text"]}\n'
            user_message += f'Criteria: {question["criteria"]}\n'

        user_message += f'And this is an additional criteria: {quiz["additional_criteria"]}\n'

        user_message += 'Calculate the score based on those criteria.\n'
        user_message += f'Here is the candidate Answer: {answer}\n'
        user_message += 'Evaluate it, and return the score and feedback in json format.\n'
        return system_message, user_message

    def generate(self, quiz, transcript):
        """
        Gets the evaluation from GPT.

        :param system_message: The system message.
        :param user_message: The user message.
        """
        logger.info('Getting the evaluation from GPT...')
        system_message, user_message = self._get_system_and_user_message(quiz, transcript)
        try:
            completion = self.client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.01
            )
            content = json.loads(completion.choices[0].message.content)
            logger.info(f"Candidate's answer evaluation: {content['score']}, {content['feedback']}")
            return content['score'], content['feedback']
        except Exception as e:
            logger.error(f'Failed to get the evaluation from GPT: {e}')
            raise RuntimeError('Failed to get the evaluation from GPT.')


class OpenAiAudioClient(OpenAiClient):
    def __init__(self, model="whisper-1"):
        super().__init__(model)


class AudioTranscriber(OpenAiAudioClient):
    def transcript_from_audio(self, local_file_name):
        """
        Transcribes an audio file.

        :param local_file_name: The local file name.
        """
        logger.info(f'Transcribing {local_file_name}...')
        audio_file = open(local_file_name, "rb")
        transcript = self.client.audio.transcriptions.create(
            model=self.model,
            file=audio_file,
            response_format="text"
        )
        logger.info(f'Transcript: {transcript}')
        return transcript
