class AccessTokenRepository:
    def __init__(self, db_client):
        self.db_client = db_client

    def create_access_token_record(self, company_id, access_token):
        """
        Creates a new access token record in the database.

        :param company_id: Unique identifier for the company associated with the token.
        :param access_token: The access token to be saved.
        """
        try:
            self.db_client .insert(token_id=access_token, company_id=company_id)
        except Exception as e:
            raise RuntimeError(f"Error saving to access token table: {e}")
