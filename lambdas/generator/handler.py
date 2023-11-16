import json
import datetime
import base64
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


def generate_criteria(event, context):

    # body = json.loads(event['body'])
    # company_id = body['company_id']
    # position = body.get('position', 'default')

    # TODO: get company github url from db
    github_account_url = "https://api.github.com/repos/takeshi8989/" # store user name in db in the first place?
    github_user_name = github_account_url.split('/')[4]
    github_user_name = "facebook"

    repository_names = get_repository_names(github_user_name)
    # print(len(repository_names))

    prompt = "Please review the following files.\n"
    for repository_name in repository_names:
        prompt = prompt + "repository:" + repository_name + ":\n"
        file_paths = get_important_file_urls(github_user_name, repository_name)
        for file_path in file_paths:
            prompt = prompt + file_path + ":\n" + get_file_contents(github_user_name, repository_name, file_path) + "\n"

    # criteria = get_criteria(prompt)

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


import requests


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


def get_important_file_urls(user_name, repo_name):
    # GitHub API
    branch = get_default_branch(user_name, repo_name)

    res = requests.get("https://api.github.com/repos/" + user_name + "/" + repo_name + "/git/trees/" + branch + "?recursive=1",
                       headers={"Authorization": "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"})
    data = res.content
    data = json.loads(data)
    tree = data['tree']
    file_paths = []
    for file in tree:
        if file['type'] == 'blob' and is_important_file(file['path']):
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


def is_important_file(path):
    # README.md, package.json, 
    if (path == 'README.md'):
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


def get_criteria(prompt):
    # TODO: call GPT-3.5 API (JSON Response)
    return []