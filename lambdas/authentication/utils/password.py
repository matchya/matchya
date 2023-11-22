import bcrypt


def hash_password(password: str) -> bytes:
    """
    Hashes a password using bcrypt.

    :param password: The plaintext password to be hashed.
    :return: The hashed password as a byte string.
    """
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)


def check_password(plain_password: str, hashed_password: bytes) -> bool:
    """
    Verifies if a plaintext password matches a hashed password.

    :param plain_password: The plaintext password for verification.
    :param hashed_password: The hashed password to check against.
    :return: True if the passwords match, False otherwise.
    """
    password_bytes = plain_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password)
