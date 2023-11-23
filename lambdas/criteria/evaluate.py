import json

import requests
from openai import OpenAI

from config import Config
from client.github import GithubClient

chat_client = OpenAI()

COMMON_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
}

def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    # Mock data for testing
    github_username = "takeshi8989"  # mock
    position_id = "1"               # mock
    github_client = GithubClient(github_username)
    # TODO: Store Candidate Information in DB (Candidate)

    candidate_result = {}
    try:
        criteria_full_messages = get_criteria_full_messages(position_id)
        candidate_result = evaluate_candidate(github_client, criteria_full_messages, github_username)
    except Exception as e:
        print(e)
        return {"statusCode": 500, "body": json.dumps({"message": "Evaluation failed."})}

    # TODO: Store data in DB (CandidateResult, AssessmentCriteria)

    return {
        "statusCode": 200, 
        "headers": COMMON_HEADERS,
        "body": json.dumps(candidate_result)
    }


def get_criteria_full_messages(position_id):
    """
    Retrieves the full message criteria for a job position.

    :param position_id: The ID of the job position.
    :return: A list of criteria in string format.
    """
    # TODO: Get Criteria full_messages by Position ID from Database
    full_messages = ["Proficiency in Python", "JavaScript Experience"]  # mock

    return full_messages


def evaluate_candidate(github_client: GithubClient, criteria_full_messages, github_username):
    """
    Evaluates a candidate's GitHub repositories against given criteria.

    :param criteria_full_messages: A list of criteria messages.
    :param github_username: The GitHub username of the candidate.
    :return: A dictionary representing the evaluation of the candidate.
    """
    pinned_repositories = get_pinned_repositories_name(github_username)
    repos_content = get_repos_content_all(github_client, github_username, pinned_repositories)
    chatgpt_evaluation = get_candidate_evaluation_from_chatgpt(criteria_full_messages, repos_content)

    return chatgpt_evaluation


def get_pinned_repositories_name(github_username):
    """
    Fetches names of pinned repositories for a given GitHub username.

    :param github_username: The GitHub username.
    :return: A list of names of pinned repositories.
    """
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
    edges = None
    try:
        edges = data.get("repositoryOwner").get("pinnableItems").get("edges")
    except Exception:
        raise Exception("Getting pinned repositories failed.")

    for edge in edges:
        name = edge.get("node").get("name")
        owner = edge.get("node").get("owner").get("login")
        if owner == github_username:
            repo_names.append(name)

    return repo_names


def run_github_query(query):
    """
    Executes a GraphQL query on GitHub's API.

    :param query: The GraphQL query string.
    :return: The data returned from the GitHub API.
    """
    try:
        res = requests.post(url=Config.GITHUB_GRAPHQL_API_URL, json={'query': query}, headers=Config.GITHUB_GRAPHQL_API_HEADERS)
        content = json.loads(res.content)
        return content.get("data")
    except Exception:
        return None


def get_repos_content_all(github_client, github_username, repo_names):
    """
    Aggregates content from multiple repositories for a given GitHub user.

    :param github_username: The GitHub username.
    :param repo_names: List of repository names to fetch content from.
    :return: A concatenated string of all contents from the specified repositories.
    """
    content = ""
    for repo_name in repo_names:
        content += get_repo_file_content(github_client, repo_name)

    return content


def get_repo_file_content(github_client: GithubClient, repo_name):
    """
    Retrieves the content of important files from a specified repository.

    :param github_username: GitHub username.
    :param repo_name: Name of the repository.
    :return: A string containing the content of important files from the repository, formatted with repository and file path information.
    """
    content = ""
    languages = github_client.get_programming_languages_used(repo_name)
    important_file_names = GithubClient.get_important_file_names(languages)
    file_paths = github_client.get_important_file_paths(repo_name, important_file_names)
    for file_path in file_paths:
        content += "repository (" + repo_name + "), file: (" + file_path + "):\n" + github_client.get_file_contents(repo_name, file_path) + "\n"

    return content


def get_candidate_evaluation_from_chatgpt(criteria_full_messages, repos_content):
    """
    Evaluates a candidate's GitHub repository contents against specified criteria using ChatGPT.

    :param criteria_full_messages: A list of criteria messages.
    :param repos_content: Content from the candidate's GitHub repositories.
    :return: A JSON object representing the candidate's evaluation scores and reasons, based on the criteria.
    """
    system_message = "A company is looking for promising employees as software engineers. Candidates need to have a skillset to work on the company's project in terms of programming languages and other technologies. These are criteria that the company needs candidates to have. You need to assess candidates on each criteria : "

    for criterion in criteria_full_messages:
        system_message += criterion + ", "

    system_message += """
        You will be given files from the candidate's GitHub repository. Please evaluate the candidate's skillset based on the files.
        Score each criteria from 0 to 10. 0 means the candidate does not have the skillset at all, and 10 means the candidate has the skillset perfectly.
        The total score is the average of all criteria scores. Please also provide a reason for each score as well.
        When you give a reason, mention the repository name, but never mention the file name.
        Your response will look like this in JSON format:
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
            {"role": "user", "content": "Follow system message instruction. Here are the files from the candidate's GitHub Account: " + repos_content}
        ]
    )
    candidate_score = json.loads(completion.choices[0].message.content)
    return candidate_score
