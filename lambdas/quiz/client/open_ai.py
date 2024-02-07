from abc import ABC, abstractmethod
import json
import os

from openai import OpenAI
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
                temperature=self.temperature
            )
            content = json.loads(completion.choices[0].message.content)
            logger.info(f"Summary: {content['summary']}")
            return content['summary']
        except Exception as e:
            logger.error(f'Failed to get the summary from GPT: {e}')
            raise RuntimeError('Failed to get the summary from GPT.')


class EvaluationGenerator(OpenAiChatClient):
    def _get_system_and_user_message(self, quiz, position_type, position_level, answer):
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
        The score is calculated based on the criteria and the candidate's answer.
        Later questions have more weight than earlier questions. For example, question 3 has more weight than question 1 since they are harder.
        Return the total score in json format with feedback.
        The feedback is calculated based on the score and what the candidate wrote.

        Your response should be a JSON object with the following fields:
        {
            "score": <score>, // 0 to 100 calculated based on the criteria
            "feedback": <feedback> // 2-3 sentences why you gave the score you gave
        }
        """

        user_message = f'Here is the quiz for position type {position_type} and position level {position_level}:\n'
        user_message += f'Context: {quiz["context"]}\n'
        user_message += 'Questions:\n'
        user_message += f'Topic: {quiz["topic"]}\n'
        user_message += f'Subtopic: {quiz["subtopic"]}\n'
        user_message += f'Difficulty: {quiz["difficulty"]}\n'
        for i in range(len(quiz['questions'])):
            question = quiz['questions'][i]
            user_message += f'Question {i + 1}. {question["text"]}\n'
            user_message += f'Criteria: {question["criteria"]}\n'

        user_message += f'Here is the candidate Answer: {answer}\n'
        user_message += 'Evaluate it, and return the score and feedback in json format.\n'
        return system_message, user_message

    def generate(self, quiz, position_type, position_level, transcript):
        """
        Gets the evaluation from GPT.

        :param system_message: The system message.
        :param user_message: The user message.
        """
        logger.info('Getting the evaluation from GPT...')
        system_message, user_message = self._get_system_and_user_message(quiz, position_type, position_level, transcript)
        try:
            completion = self.client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.5
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
