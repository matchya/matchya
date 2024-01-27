import os
from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class Assessment:
    def __init__(self, name, position_type, position_level, topics=[]):
        logger.info(f'__init__: {name}, {position_type}, {position_level}, {topics}')
        self._id = None
        if not name:
            raise ValueError('name is required')
        self.name = name
        if not position_type:
            raise ValueError('position_type is required')
        self.position_type = position_type
        if not position_level:
            raise ValueError('position_level is required')
        self.position_level = position_level
        
        self.topics = topics

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        if value is None:
            raise ValueError('id cannot be None')
        self._id = value
