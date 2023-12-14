from cryptography.fernet import Fernet

from config import Config


def decrypt_github_access_token(encrypted_token: bytes) -> str:
    """
    Decrypts a GitHub access token.

    :param encrypted_token: The encrypted access token to be decrypted.
    :return: The decrypted access token as a string.
    """
    if isinstance(encrypted_token, memoryview):
        encrypted_token = encrypted_token.tobytes()
    key = Config.GITHUB_FERNET_KEY
    cipher_suite = Fernet(key.encode())
    return cipher_suite.decrypt(encrypted_token).decode()
