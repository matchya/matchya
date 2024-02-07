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
