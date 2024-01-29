class Question:
    def __init__(self, text, difficulty, topic, id=None, created_at=None):
        self.id = id
        self.created_at = str(created_at)
        if not text:
            raise ValueError('text is required')
        self.text = text
        if not difficulty:
            raise ValueError('difficulty is required')
        self.difficulty = difficulty
        if not topic:
            raise ValueError('topic is required')
        self.topic = topic

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'difficulty': self.difficulty,
            'topic': self.topic,
            'created_at': self.created_at
        }
