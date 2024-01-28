import os
import requests
import json

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '.')))


class GoogleClient:
    @staticmethod
    def get_user_details(access_token):
        """
        Gets the Google username and email address of the user.

        :param gh_access_token: The Google access token.
        :return: The Google username and email address of the user.
        """
        try:
            logger.info("Getting the Google username and email address...")
            res = requests.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token)
            data = json.loads(res.content)
            return data['name'], data['email']
        except Exception as e:
            raise RuntimeError(f"Error getting Google user details: {e}")
