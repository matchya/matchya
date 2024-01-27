import os
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class Interview:
    def __init__(self, assessment_id):
        self._id = None
        self._candidate_id = None
        if not assessment_id:
            raise ValueError('assessment_id is required')
        self.assessment_id = assessment_id

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        if value is None:
            raise ValueError('id cannot be None')
        self._id = value

    @property
    def candidate_id(self):
        return self._candidate_id

    @candidate_id.setter
    def candidate_id(self, value):
        if value is None:
            raise ValueError('candidate_id cannot be None')
        self._candidate_id = value
