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
        interview_access_token = kwargs.get('interview_access_token')
        interview_id = kwargs.get('interview_id')
        candidate_name = kwargs.get('candidate_name')
        company_name = kwargs.get('company_name')

        interview_link = f"{Config.LINK_BASE_URL}/auth/invitation?access_token={interview_access_token}&interview_id={interview_id}"

        body = """
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: Cambria, sans-serif;
                "
            >
                <div style="width: 300px; margin: 0 auto">
                    <img
                        style="width: 12rem; margin-top: 1.5rem; margin-bottom: 2.5rem"
                        src="https://matchya-assets.s3.amazonaws.com/Matchya-sticker.png"
                        alt="logo"
                    />
                    <h1 style="font-size: 1.5rem; font-weight: bold">Hi {candidate_name}</h1>
                    <p style="margin-top: 1rem">
                        You've been invited to take an assessment for {company_name}.
                    </p>
                    <p style="margin-top: 1rem">
                        Our Matchya assessment focuses on system design and problem-solving
                        skills used in practice, not just coding skills. Once you click the
                        button below, you will jump to the instruction page. Please make sure
                        that you have access to a camera and microphone and that you take the
                        exam in a quiet environment.
                    </p>
                    <p style="margin-top: 1rem; font-weight: bold">
                        You can start the assessment by clicking below:
                    </p>
                    <a href="{interview_link}" style="text-decoration: none">
                        <button
                            style="
                            margin-top: 0.5rem;
                            background-color: #34d399;
                            color: white;
                            font-size: 1rem;
                            padding: 0.75rem 1.25rem;
                            border: none;
                            border-radius: 0.25rem;
                            cursor: pointer;
                            "
                        >
                            Go to Assessment
                        </button>
                    </a>

                    <p style="margin-top: 1rem">
                        Best wishes, <br />
                        Matchya Team
                    </p>

                    <div style="margin-top: 2.5rem; border-bottom: 2px solid #d1d5db"></div>

                    <p style="margin-top: 2.5rem">
                    If you have any questions, please contact us at:
                    <a
                        style="color: #3b82f6; text-decoration: underline"
                        href="mailto:admin@matchya.ai"
                        >admin@matchya.ai</a
                    >
                    </p>
                </div>
            </div>
        """.format(candidate_name=candidate_name, company_name=company_name, interview_link=interview_link)
        return body
