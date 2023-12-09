

def compress_file_content(file_name, file_content):
    """Compress file content using gzip.

    param: file_content (str): File content to compress.
    return:str: Compressed file content.
    """
    if file_name.endswith(".py"):
        return compress_python_file(file_content)

    return file_content.replace(" ", "").replace("\n", "").replace("\"", "").replace("\'", "")


def compress_python_file(file_content):
    """Compress python file content using gzip.

    param: file_content (str): Python file content to compress.
    return:str: Compressed python file content.
    """

    # TODO: Add more compression rules for python files.
    return file_content.replace(" ", "").replace("\n", "").replace("\"", "").replace("\'", "")


# TODO: Add more compression rules for other file types.
