import os
import time
import uuid

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


def retrieve_interview_access_token(interview_access_token_repo, candidate_id, interview_id):
    # check if the token already exists and is not expired
    access_tokens = interview_access_token_repo.retrieve_by_candidate_interview_ids(candidate_id=candidate_id, interview_id=interview_id)
    if not len(access_tokens):
        # create a new interview access token
        access_token = str(uuid.uuid4())
        interview_access_token_repo.insert(token=access_token, candidate_id=candidate_id, interview_id=interview_id, expiry_time=int(time.time()) + 3600, status='PENDING')
    else:
        access_token = access_tokens[0]['token']
        # if the token already exists, we want to make sure it's not expired
        if access_tokens[0]['expiry_time'] < int(time.time()):
            logger.info(f'Token {access_token} has expired. Generating a new one.')
            # update the expiry time
            interview_access_token_repo.update(token=access_token, expiry_time=int(time.time()) + 3600)
    return access_token
