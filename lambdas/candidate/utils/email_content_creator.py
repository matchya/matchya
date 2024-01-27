from abc import ABC
import os

import html2text

from config import Config
from utils.logger import Logger


logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class EmailContentGenerator(ABC):
    @classmethod
    def generate(cls, **kwargs):
        body_html = cls._get_body_html(**kwargs)
        return body_html, cls._convert_html_to_markdown(body_html)

    @classmethod
    def _get_body_html(cls):
        pass

    @classmethod
    def _convert_html_to_markdown(cls, body_html):
        logger.info('Converting html to text')
        html_converter = html2text.HTML2Text()
        return html_converter.handle(body_html)


class CandidateInviteEmailContentGenerator(EmailContentGenerator):
    @classmethod
    def _get_body_html(cls, **kwargs):
        logger.info(f'Creating html based on {kwargs}')
        interview_id = kwargs.get('interview_id')
        interview_link = f"{Config.LINK_BASE_URL}/interviews/{interview_id}/record"
        body = """
            <h1>You received an invitation to Matchya Assessment from Matchya</h1>
            <p>Click this link to start the assessment: 
                <a href='%s'>Take the assessment now</a>
            </p>
            <p>(Test email... link is not working yet)</p>
        """ % interview_link
        return body
