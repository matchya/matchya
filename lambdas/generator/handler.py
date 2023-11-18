import json
import datetime
import base64
import requests
import os
from os.path import join, dirname
from dotenv import load_dotenv
from openai import OpenAI

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

chat_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])


def generate_criteria(event, context):

    # body = json.loads(event['body'])
    # company_id = body['company_id']
    # position = body.get('position', 'default')

    # TODO: get company github url from db
    github_repo_url = "https://github.com/kokiebisu/rental-storage" # mock

    github_user_name = github_repo_url.split('/')[-2]
    repository_name = github_repo_url.split('/')[-1]

    languages = get_programming_languages_used(github_user_name, repository_name)

    important_file_names = get_important_file_names(github_user_name, repository_name, languages)

    prompt = "Please review the following files.\n"
    file_paths = get_important_file_urls(github_user_name, repository_name, important_file_names)
   
    for file_path in file_paths:
        prompt = prompt + file_path + ":\n" + get_file_contents(github_user_name, repository_name, file_path) + "\n"

    criteria = get_criteria(prompt, languages)

    print("Generated Criteria: ", criteria)
    # # TODO: save criteria to db
    # # ...

    criteria_id = '1' # mock
    created_at = str(datetime.datetime.now())

    body = {
        "critria_id": criteria_id,
        "created_at": created_at,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response




def get_programming_languages_used(github_username, repository_name):
    res = requests.get("https://api.github.com/repos/" + github_username + "/" + repository_name + "/languages", 
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"})
    data = res.content
    data = json.loads(data)
    languages = []
    for language in data:
        languages.append({"name": language, "bytes": data[language]})
    return languages

def get_important_file_names(github_username, repository_name, languages):
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



def get_repository_names(github_username):
    # GitHub API
    res = requests.get("https://api.github.com/users/" + github_username + "/repos", 
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"})
    data = res.content
    data = json.loads(data)
    repository_urls = []
    for repo in data:
        repository_urls.append(repo['name'])
    return repository_urls


def get_important_file_urls(user_name, repo_name, important_file_names):
    # GitHub API
    branch = get_default_branch(user_name, repo_name)

    res = requests.get("https://api.github.com/repos/" + user_name + "/" + repo_name + "/git/trees/" + branch + "?recursive=1",
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"})
    data = res.content
    data = json.loads(data)
    tree = data['tree']
    file_paths = []
    for file in tree:
        if file['type'] == 'blob' and is_important_file(file['path'], important_file_names):
            file_paths.append(file['path'])
    return file_paths


def get_default_branch(user_name, repo_name):
    # GitHub API
    res = requests.get("https://api.github.com/repos/" + user_name + "/" + repo_name,
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"}
                    )
    data = res.content
    data = json.loads(data)
    return data['default_branch']


def is_important_file(path, important_file_names):
    # get files with names in important_file_names, and only contains ~2 / (not in a subdirectory)
    for file_name in important_file_names:
        if file_name in path and path.count('/') <= 1:
            return True
    return False


def get_file_contents(github_user_name, repository_name, file_path):
    res = requests.get("https://api.github.com/repos/" + github_user_name + "/" + repository_name + "/contents/" + file_path,
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"})
    data = res.content
    data = json.loads(data)
    content_encoded = data['content']
    content = str(base64.b64decode(content_encoded))
    return content


def get_criteria(prompt, languages):
    system_message = "You read the following files. Please review them and generate a list of programming languages, libraries, and other technologies used in the project. You should always put these languages first in the head of the list in order." + "Languages:"
    for language in languages:
        system_message = system_message + language['name'] + ", "

    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_message },
            {"role": "user", "content": "Generate a list of string in json format. the list contains programming languages, libraries, and other technologies used in the project as 1d string list. name the list \"criteria\".\n\n" + prompt}
        ]
    )
    content = json.loads(completion.choices[0].message.content)
    criteria = content['criteria']
    return criteria