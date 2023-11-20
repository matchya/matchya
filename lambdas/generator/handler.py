import json
import datetime
import base64
import requests
import uuid
import boto3
import os
from os.path import join, dirname

from dotenv import load_dotenv
from openai import OpenAI


# Load environment variables
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# DynamoDB
environment = os.environ.get('ENVIRONMENT')
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
criteria_table = dynamodb.Table(f'{environment}-Criteria')

chat_client = OpenAI()

GITHUB_API_HEADERS = {'Authorization-Type': "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"}


def generate_criteria(event, context):

    try:
        body = event.get('body', '')
        if not body:
            raise json.JSONDecodeError
        body = json.loads(event.get('body', ''))
    except json.JSONDecodeError:
        return {'statusCode': 400, 'body': 'Invalid JSON in request body'}


    # Validate that required fields are present
    position_id = body.get('position_id', '')

    # TODO: Get github_username and repo names from database by position_id
    github_username = "kokiebisu"
    repo_names = ["rental-storage"]
    repository_name = repo_names[0]     # TODO: For loop


    programming_languages = get_programming_languages_used(github_username, repository_name)
    file_names_containing_repo_tech_stack = get_readme_and_package_files(programming_languages)

    prompt = "Please review the following files.\n"
    file_paths = get_file_paths_in_repo(github_username, repository_name, file_names_containing_repo_tech_stack)

    for file_path in file_paths:
        prompt = prompt + file_path + ":\n" + get_file_content(github_username, repository_name, file_path) + "\n"

    criteria_keywords = get_criteria_keywords(prompt, programming_languages)
    print("criteria: ", criteria_keywords)

    criterion_id = str(uuid.uuid4())
    created_at = str(datetime.datetime.now())

    #TODO: Save criteria to database

    body = {
        "criterion_id": criterion_id,
        "created_at": created_at,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response


def get_programming_languages_used(github_username, repository_name):
    url = "https://api.github.com/repos/" + github_username + "/" + repository_name + "/languages"
    res = requests.get(url, headers=GITHUB_API_HEADERS)

    data = json.loads(res.content)
    languages = []
    for language in data:
        languages.append({"name": language, "bytes": data[language]})
    return languages

# get README.md and other important file names according to the programming languages used
def get_readme_and_package_files(languages):
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


def get_file_paths_in_repo(github_username, repo_name, file_names_containing_repo_tech_stack):
    branch = _get_default_branch(github_username, repo_name)

    url = "https://api.github.com/repos/" + github_username + "/" + repo_name + "/git/trees/" + branch + "?recursive=1"
    res = requests.get(url, headers=GITHUB_API_HEADERS)

    data = json.loads(res.content)
    tree = data['tree']
    file_paths = []
    for branch in tree:
        if should_include_the_branch(branch, file_names_containing_repo_tech_stack):
            file_paths.append(branch['path'])
    return file_paths


def _get_default_branch(github_username, repo_name):
    url = "https://api.github.com/repos/" + github_username + "/" + repo_name
    res = requests.get(url, headers=GITHUB_API_HEADERS)

    data = json.loads(res.content)
    return data['default_branch']


# This function is used to filter out the branches that are not needed
def should_include_the_branch(branch, file_names_containing_repo_tech_stack):
    branch_name = branch['path'].split('/')[-1]
    is_file = branch['type'] == 'blob'
    does_contain_info = branch_name in file_names_containing_repo_tech_stack
    in_root_or_subroot_dir = branch['path'].count('/') <= 1

    return is_file and does_contain_info and in_root_or_subroot_dir

# Read file content
def get_file_content(github_username, repository_name, file_path):
    url = "https://api.github.com/repos/" + github_username + "/" + repository_name + "/contents/" + file_path
    res = requests.get(url, headers=GITHUB_API_HEADERS)

    data = json.loads(res.content)
    content_encoded = data['content']
    content = str(base64.b64decode(content_encoded))
    return content


def get_criteria_keywords(prompt, languages):
    system_message = "You read the following files. Please review them and generate a list of programming languages, libraries, and other technologies used in the project. You should always put these languages first in the head of the list in order." + "Languages:"
    for language in languages:
        system_message = system_message + language['name'] + ", "

    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": "Generate a list of string in json format. the list contains programming languages, libraries, and other technologies used in the project as 1d string list. name the list \"criteria\".\n\n" + prompt}
        ]
    )
    content = json.loads(completion.choices[0].message.content)
    criteria_keywords = content['criteria']     # The array of keywords, string[]
    return criteria_keywords
