import json
import base64
import os
from os.path import join, dirname
import requests
from dotenv import load_dotenv
from openai import OpenAI

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

chat_client = OpenAI()


GITHUB_REST_API_HEADERS = {'Authorization-Type': "Bearer " + os.environ['GITHUB_TOKEN'], "X-GitHub-Api-Version": "2022-11-28"}
GITHUB_API_REPO_URL = "https://api.github.com/repos/"
GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql"

def evaluate_candidate(event, context):
    # body = json.loads(event.get("body"))
    # position_id = body.get("position_id")
    # first_name = body.get("candidate_first_name")
    # last_name = body.get("candidate_last_name")
    # email = body.get("candidate_email")
    # github_username = body.get("candidate_github_username")
    github_username = "takeshi8989" # mock
    position_id = "1"               # mock

    # TODO: Store Candidate Information in DB (Candidate)

    criteria_full_messages = get_criteria_full_messages(position_id)
    candidate_result = evaluate_candidate(criteria_full_messages, github_username)

    # TODO: Store data in DB (CandidateResult, AssessmentCriteria)

    return {"statusCode": 200, "body": json.dumps(candidate_result)}


def get_criteria_full_messages(position_id):
    # TODO: Get Criteria full_messages by Position ID from Database
    full_messages = ["Proficiency in Python", "JavaScript Experience"] # mock

    return full_messages

def evaluate_candidate(criteria_full_messages, github_username):
    pinned_repositories = get_pinned_repositories_name(github_username)
    repos_content = get_repos_content_all(github_username, pinned_repositories)
    chatgpt_evaluation = get_candidate_evaluation(criteria_full_messages, repos_content)

    return chatgpt_evaluation


def get_pinned_repositories_name(github_username):
    repo_names = []
    query = """
    {
        repositoryOwner(login: "%s") {
            ... on User {
                pinnableItems(first: 6, types: REPOSITORY) {
                    edges {
                        node {
                            ... on Repository {
                                name
                                owner {
                                    login
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    """ % github_username
    data = run_github_query(query)

    edges = data.get("repositoryOwner").get("pinnableItems").get("edges")
    for edge in edges:
        name = edge.get("node").get("name")
        owner = edge.get("node").get("owner").get("login")
        if owner == github_username:
            repo_names.append(name)
    
    return repo_names


def run_github_query(query):
    try:
        api_token = os.environ['GITHUB_TOKEN']
        graphql_headers = {'Authorization': 'token %s' % api_token}
        res = requests.post(url=GITHUB_GRAPHQL_API_URL, json={'query': query}, headers=graphql_headers)
        content = json.loads(res.content)
        return content.get("data") 
    except Exception as e:
        return None


def get_repos_content_all(github_username, repo_names):
    content = ""
    for repo_name in repo_names:
        content += get_repo_file_content(github_username, repo_name)
    
    return content


def get_repo_file_content(github_username, repo_name):
    content = ""
    languages = get_programming_languages_used(github_username, repo_name)
    important_file_names = get_important_file_names(languages)
    file_paths = get_important_file_urls(github_username, repo_name, important_file_names)
    for file_path in file_paths:
        content += "repository (" + repo_name + "), file: (" + file_path + "):\n" + get_file_contents(github_username, repo_name, file_path) + "\n"

    return content


def get_candidate_evaluation(criteria_full_messages, repos_content):
    system_message = "A company is looking for promising employees as software engineers. Candidates need to have a skillset to work on the company's project in terms of programming languages and other technologies. These are criteria that the company needs candidates to have. You need to assess candidates on each criteria : "
    
    for criterion in criteria_full_messages:
        system_message += criterion + ", "
    
    system_message += """
        You will be given files from the candidate's GitHub repository. Please evaluate the candidate's skillset based on the files. 
        Score each criteria from 0 to 10. 0 means the candidate does not have the skillset at all, and 10 means the candidate has the skillset perfectly. 
        The total score is the avarage of all criteria scores. Please also provide a reason for each score as well.
        When you give a reason, mention the repository name, but never mention the file name.
        Your response will looks like this in JSON format:
        {
            "total_score": number, // average score from 0 to 10
            "summary": string, // general comment about the candidate's skillset
            "assessments": [
                {
                    "criterion": string, // criterion
                    "score": number, // score from 0 to 10
                    "reason": string // reason for the score
                },
                {
                }, ... // other criteria
            ]
        }
    """
    

    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": "Follow system message instruction. Here is the files from the candidate's GitHub Account: " + repos_content}
        ]
    )
    candidate_score = json.loads(completion.choices[0].message.content)
    return candidate_score





### Also used in generator lambda ###

def get_default_branch(github_username, repo_name):
    url = GITHUB_API_REPO_URL + github_username + "/" + repo_name
    res = requests.get(url, headers=GITHUB_REST_API_HEADERS)

    data = json.loads(res.content)
    if data is None or data.get('default_branch') is None:
        print("default branch not found / api limit exceeded", repo_name)
        print(data)
        exit(1)
    return data['default_branch']


def get_programming_languages_used(github_username, repository_name):
    url = GITHUB_API_REPO_URL + github_username + "/" + repository_name + "/languages"
    res = requests.get(url, headers=GITHUB_REST_API_HEADERS)

    data = json.loads(res.content)
    languages = []
    for language in data:
        languages.append({"name": language, "bytes": data[language]})
    return languages

def get_important_file_names(languages):
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


def get_important_file_urls(github_username, repo_name, important_file_names):
    branch = get_default_branch(github_username, repo_name)

    url = GITHUB_API_REPO_URL + github_username + "/" + repo_name + "/git/trees/" + branch + "?recursive=1"
    res = requests.get(url, headers=GITHUB_REST_API_HEADERS)

    data = json.loads(res.content)
    tree = data['tree']
    file_paths = []
    for file in tree:
        if file['type'] == 'blob' and is_important_file(file['path'], important_file_names):
            file_paths.append(file['path'])
    return file_paths

def is_important_file(path, important_file_names):
    for file_name in important_file_names:
        if file_name in path and path.count('/') <= 1:
            return True
    return False


def get_file_contents(github_username, repository_name, file_path):
    url = GITHUB_API_REPO_URL + github_username + "/" + repository_name + "/contents/" + file_path
    res = requests.get(url, headers=GITHUB_REST_API_HEADERS)

    data = json.loads(res.content)
    if data is None or data.get('content') is None:
        return ""
    content_encoded = data['content']
    content = str(base64.b64decode(content_encoded))
    return content
