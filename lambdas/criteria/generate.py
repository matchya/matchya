import json
import datetime
import base64
import uuid

import requests
import boto3
from openai import OpenAI

from config import Config
from client.github import GithubClient

from utils.response import generate_response, generate_success_response

# DynamoDB
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
criteria_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Criteria')

chat_client = OpenAI()

def handler(event, context):
    """
    Lambda function entry point to generate criteria from GitHub repositories.

    :param event: The event triggering the lambda, contains request data.
    :param context: The runtime context of the lambda.
    :return: A dictionary with HTTP status code and response body.
    """
    try:
        body = event.get('body', '')
        if not body:
            raise json.JSONDecodeError
        body = json.loads(event.get('body', ''))
    except json.JSONDecodeError:
        return generate_response(400, json.dumps({"message": "Invalid JSON in request body"}))

    # Validate that required fields are present
    # position_id = body.get('position_id', '')

    # TODO: Get github_username and repo names from database by position_id
    github_username = "kokiebisu"
    repo_names = ["rental-storage"]
    repository_name = repo_names[0]
    github_client = GithubClient(github_username)

    programming_languages = github_client.get_programming_languages_used(repository_name)
    file_names_containing_repo_tech_stack = get_readme_and_package_files(programming_languages)

    prompt = "Please review the following files.\n"
    file_paths = github_client.get_file_paths_in_repo(github_username, repository_name, file_names_containing_repo_tech_stack)

    for file_path in file_paths:
        prompt = prompt + file_path + ":\n" + get_file_content(github_username, repository_name, file_path) + "\n"

    criteria_keywords = get_criteria_keywords(prompt, programming_languages)
    print("criteria: ", criteria_keywords)

    criterion_id = str(uuid.uuid4())
    created_at = str(datetime.datetime.now())
    # TODO: Save criteria to database logic here...

    body = {
        "criteria": criteria_keywords,
        "created_at": created_at
    }
    return generate_success_response(body)


def get_readme_and_package_files(languages):
    """
    Determines important file names based on the programming languages used in a repository.

    :param languages: A list of programming languages used in the repository.
    :return: A list of important file names like README.md, requirements.txt, etc.
    """
    important_file_names = ["README.md"]

    package_file_names = {
        "Python": "requirements.txt",
        "JavaScript": "package.json",
        "Ruby": "Gemfile",
        "Java": "pom.xml",
        "Go": "go.mod",
        "php": "composer.json",
        "C#": "packages.config",
        "C++": "CMakeLists.txt",
        "C": "Makefile",
        "TypeScript": "package.json",
        "Shell": "package.json",
        "Kotlin": "build.gradle",
        "Rust": "Cargo.toml",
        "Swift": "Package.swift",
    }

    for language in languages:
        if language['name'] in package_file_names:
            important_file_names.append(package_file_names[language['name']])

    return important_file_names


def get_file_content(github_username, repository_name, file_path):
    """
    Retrieves the content of a specific file from a GitHub repository.

    :param github_username: GitHub username of the repository owner.
    :param repository_name: Name of the GitHub repository.
    :param file_path: Path of the file within the repository.
    :return: The content of the specified file.
    """
    url = Config.GITHUB_API_REPO_URL + github_username + "/" + repository_name + "/contents/" + file_path
    res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
    data = json.loads(res.content)
    content_encoded = data['content']
    return str(base64.b64decode(content_encoded))


def get_criteria_keywords(prompt, languages):
    """
    Generates a list of criteria keywords using OpenAI's ChatGPT based on given prompt and programming languages.

    :param prompt: A string prompt containing file contents and information.
    :param languages: A list of programming languages used in the project.
    :return: A list of criteria keywords extracted from the prompt and language list.
    """
    system_message = "You read the following files. Please review them and generate a list of programming languages, libraries, and other technologies used in the project. You should always put these languages first in the head of the list in order." + "Languages:"
    for language in languages:
        system_message += language['name'] + ", "

    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": "Generate a list of string in json format. the list contains programming languages, libraries, and other technologies used in the project as 1d string list. name the list \"criteria\".\n\n" + prompt}
        ]
    )
    content = json.loads(completion.choices[0].message.content)
    return content['criteria']  # The array of keywords, string[]
