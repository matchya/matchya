from abc import ABC
import os

import html2text

from config import Config
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class EmailContentGenerator(ABC):
    def generate():
        pass

    def _get_body_html():
        pass

    def _get_body_text():
        pass


class CandidateInviteEmailContentGenerator(EmailContentGenerator):
    @classmethod
    def generate(cls, interview_id):
        body_html = cls._get_body_html(interview_id)
        return body_html, cls._get_body_text(body_html)

    @classmethod
    def _get_body_html(cls, interview_id):
        logger.info('get_body_html')
        interview_link = f"{Config.LINK_BASE_URL}/interviews/{interview_id}/record"
        body = """
            <h1>You received an invitation to Matchya Assessment from Matchya</h1>
            <p>Click this link to start the assessment: 
                <a href='%s'>Take the assessment now</a>
            </p>
            <p>(Test email... link is not working yet)</p>
        """ % interview_link
        return body

    @classmethod
    def _get_body_text(cls, body_html):
        logger.info('get_body_text')
        html_converter = html2text.HTML2Text()
        body_text = html_converter.handle(body_html)
        return body_text
