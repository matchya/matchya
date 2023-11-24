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

    criteria = get_criteria_from_gpt(prompt, programming_languages)
    print("generated criteria:", criteria)

    criterion_id = str(uuid.uuid4())
    created_at = str(datetime.datetime.now())
    # TODO: Save criteria to database logic here...

    criteria_messages = [criterion['message'] for criterion in criteria]

    body = {
        "criteria": criteria_messages,
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


def get_criteria_from_gpt(prompt, languages):
    """
    Generates a list of criteria keywords using OpenAI's ChatGPT based on given prompt and programming languages.

    :param prompt: A string prompt containing file contents and information.
    :param languages: A list of programming languages used in the project.
    :return: A list of criteria keywords extracted from the prompt and language list.
    """
    system_message = """
        You are tasked with analyzing our company's repository files to identify specific skills and technologies necessary for candidates applying to our company. 
        The goal is to create a set of criteria that accurately reflect the core technologies and key aspects of software development pertinent to our projects. 
        Your response must be in JSON format, with each essential skill or technology represented as an independent criterion. Please adhere to the following detailed instructions:

        1. **Format Specification**: Structure the response in JSON format. Each entry should consist of a 'keywords' array and a 'message' string within a criterion object.

        2. **Individual Major Technologies**: Each major technology must be treated as a distinct and separate criterion. 
            This is imperative for technologies like Docker, AWS, Terraform, Kubernetes, Python, and JavaScript, among others. 
            It is essential to understand that each of these technologies is a critical and standalone skill. 
            For example, 'Docker' should form its own criterion focusing exclusively on containerization skills, 'AWS' on cloud services and infrastructure, and 'Terraform' on infrastructure as code. 
            This approach is necessary because a candidate might have deep expertise in one of these areas (like Docker) but limited knowledge in another (like Terraform). 
            Thus, creating separate criteria for each ensures a clear and accurate assessment of a candidate's specific skills in each of these significant technologies. 
            Avoid grouping these major technologies under any circumstance to ensure precise evaluation of candidate abilities in each distinct area.
        
        3. **Grouping of Related Tools**: Combine technologies or tools that are closely related and often used together into a single criterion. 
            For example, 'Git' and 'GitHub' can be grouped together for version control, and 'React' with 'Next.js' for front-end development. 
            This grouping should be judicious, maintaining relevance and coherence.

        4. **Descriptive Messages**: Each criterion should include a brief message, preferably within 5-6 words, describing the role and importance of the technology or skill in our projects. 
            Never use too long message like 10 words, it's too long. For example, 'JavaScript for client-side scripting' or 'AWS for cloud services'.

        5. **Focus on Relevance**: Prioritize technologies that are central to our projects, including key programming languages, frameworks, and infrastructure elements. 
            Exclude minor tools or libraries unless they hold particular relevance.

        6. **Clear Criteria for Each Technology**: Ensure each criterion is focused and revolves around a single, coherent concept, aiding in accurate candidate assessment.

        7. **Number of Criteria**: Target around 8-10 criteria, but this can vary (6 to 12) depending on the repository's contents, ensuring comprehensive coverage without overcomplication.

        8. **Guidance from Repository Data**: Utilize the provided details on programming languages and technologies in our repositories to guide the inclusion and emphasis of relevant languages and technologies in your criteria.

        Your response must be in the following JSON format like this (example):
        {
            "criteria": [
                {
                    "keywords": ["Python", "API"],
                    "message": "Python for back-end development and API creation"
                },
                {
                    "keywords": ["React", "Next.js"],
                    "message": "React and Next.js for front-end development"
                },
                {
                    "keywords": ["Docker"],
                    "message": "Docker for containerization"
                },
                // more criteria
            ]
        }

        Ensure that the response strictly adheres to these guidelines to formulate a clear, relevant, and effective set of criteria for evaluating potential candidates.
        Below is the data on programming languages used in our repositories, which should guide the inclusion of relevant languages in your criteria.
    """
    for language in languages:
        system_message += language['name'] + "(" + str(language['bytes']) + " bytes), "


    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": "Perform your task according to the system message. These are the company's repositories and the file contents." + prompt}
        ]
    )
    content = json.loads(completion.choices[0].message.content)
    return content['criteria']  # The array of keywords, string[]
