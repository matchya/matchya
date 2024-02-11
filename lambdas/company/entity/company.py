class Company:
    def __init__(self, id):
        if not id:
            raise ValueError('Company id is required.')
        self.id = id
