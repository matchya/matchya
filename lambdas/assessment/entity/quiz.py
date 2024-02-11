class Quiz:
    def __init__(self, difficulty, topic, subtopic, description, is_original, id=None, context=None, created_at=None):
        self.id = id
        self.context = context
        self.created_at = str(created_at)

        if difficulty is None:
            raise ValueError('difficulty is required')
        self.difficulty = difficulty
        if topic is None:
            raise ValueError('topic is required')
        self.topic = topic
        if subtopic is None:
            raise ValueError('subtopic is required')
        self.subtopic = subtopic
        if description is None:
            raise ValueError('description is required')
        self.description = description
        if is_original is None:
            raise ValueError('is_original is required')
        self.is_original = is_original

    def to_dict(self):
        return {
            'id': self.id,
            'context': self.context,
            'difficulty': self.difficulty,
            'topic': self.topic,
            'subtopic': self.subtopic,
            'description': self.description,
            'is_original': self.is_original,
            'created_at': self.created_at
        }
