import os
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class Candidate:
    def __init__(self):
        self._id = None
        self._name = None
        self._email = None
        self._assessment = None

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        if value is None:
            raise ValueError('id cannot be None')
        self._id = value

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        if value is None:
            raise ValueError('name cannot be None')
        self._name = value

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if value is None:
            raise ValueError('email cannot be None')
        self._email = value

    @property
    def assessment(self):
        return self._assessment

    @assessment.setter
    def assessment(self, value):
        if value is None:
            raise ValueError('assessment cannot be None')
        self._assessment = value

    def to_dict(self):
        result = {
            'id': self._id,
            'name': self._name,
            'email': self._email,
            'assessment': self._assessment,
        }
        if self._assessment:
            result['assessment'] = self._assessment
        return result
