class Token:
    def __init__(self, value):
        if not value:
            raise ValueError('Token is required.')
        self.value = value
