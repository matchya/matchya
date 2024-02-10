import os
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class Quiz:
    def __init__(self):
        self._id = None
        self._description = None
        self._topic = None
        self._subtopic = None
        self._difficulty = None
        self._created_at = None
        self._context = None
        self._is_original = None
        self._questions = []
        self._additional_criteria = None
        self._max_score = None

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        if value is None:
            raise ValueError('id cannot be None')
        self._id = value

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value):
        if value is None:
            raise ValueError('description cannot be None')
        self._description = value

    @property
    def topic(self):
        return self._topic

    @topic.setter
    def topic(self, value):
        if value is None:
            raise ValueError('topic cannot be None')
        self._topic = value

    @property
    def subtopic(self):
        return self._subtopic

    @subtopic.setter
    def subtopic(self, value):
        if value is None:
            raise ValueError('subtopic cannot be None')
        self._subtopic = value

    @property
    def difficulty(self):
        return self._difficulty

    @difficulty.setter
    def difficulty(self, value):
        if value is None:
            raise ValueError('difficulty cannot be None')
        self._difficulty = value

    @property
    def created_at(self):
        return self._created_at

    @created_at.setter
    def created_at(self, value):
        if value is None:
            raise ValueError('created_at cannot be None')
        self._created_at = value

    @property
    def context(self):
        return self._context

    @context.setter
    def context(self, value):
        if value is None:
            raise ValueError('context cannot be None')
        self._context = value

    @property
    def is_original(self):
        return self._is_original

    @is_original.setter
    def is_original(self, value):
        if value is None:
            raise ValueError('is_original cannot be None')
        self._is_original = value
    
    @property
    def questions(self):
        return self._questions
    
    @questions.setter
    def questions(self, value):
        if value is None:
            raise ValueError('questions cannot be None')
        self._questions = value
        
    @property
    def additional_criteria(self):
        return self._additional_criteria
    
    @additional_criteria.setter
    def additional_criteria(self, value):
        self._additional_criteria = value
        
    @property
    def max_score(self):
        return self._max_score
    
    @max_score.setter
    def max_score(self, value):
        self._max_score = value

    def to_dict(self):
        result = {
            'id': self._id,
            'description': self._description,
            'topic': self._topic,
            'subtopic': self._subtopic,
            'difficulty': self._difficulty,
            'created_at': str(self._created_at)
        }
        if self._context:
            result['context'] = self._context
        if self._is_original:
            result['is_original'] = self._is_original
        if self._questions:
            result['questions'] = self._questions
        if self._additional_criteria:
            result['additional_criteria'] = self._additional_criteria
        if self._max_score:
            result['max_score'] = self._max_score
        return result
