import json
import datetime
import uuid

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
        body = parse_request_body(event)
        validate_request_body(body)
        position_id = body.get('position_id')
        repository_names = body.get('repository_names')

        github_username = get_github_username_from_position_id(position_id)
        github_client = GithubClient(github_username)
        criteria = generate_criteria(github_client, repository_names)

        save_criteria_to_dynamodb(criteria, position_id)
        body = { "criteria": criteria }
        return generate_success_response(body)
    except (ValueError, RuntimeError) as e:
        return generate_response(400, {"message": str(e)})
    except Exception as e:
        print(e)
        return generate_response(500, {"message": f"Failed to generate criteria: {e}"})


def parse_request_body(event):
    """
    Parses the request body from an event and returns it as a JSON object.

    :param event: The event object containing the request data.
    :return: Parsed JSON object from the request body.
    """
    try:
        body = event.get('body', '')
        if not body:
            raise ValueError("Empty body")
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in request body: {e}")

def validate_request_body(body):
    """
    Validates the necessary fields in the company data.

    :param body: The request body containing company data.
    """
    required_fields = ['position_id', 'repository_names']
    if not all(body.get(field) for field in required_fields):
        raise ValueError('Missing required fields')
    if len(body['repository_names']) < 1:
        raise ValueError('At least one repository name is required')

def get_github_username_from_position_id(position_id):
    """
    Retrieves the GitHub username of the company from the database.
    
    :param position_id: Unique identifier for the position.
    :return: The GitHub username of the company.
    """
    # TODO: Get github_username from postgres by position_id
    return 'kokiebisu'

def generate_criteria(github_client: GithubClient, repository_names):
    """
    Generates criteria from GitHub repositories.
    
    :param github_client: A GitHub client object.
    :param repository_names: A list of repository names.
    :return: A list of criteria.
    """
    file_content = ""
    programming_languages_map_all_in_repo = {}
    try:
        for repository_name in repository_names:
            programming_languages_map = github_client.get_programming_languages_used(repository_name)
            file_content += github_client.get_repo_file_content(repository_name, programming_languages_map)
            accumulate_language_data(programming_languages_map_all_in_repo, programming_languages_map)
    except Exception as e:
        raise RuntimeError(f"Error Reading files: {e}")

    return get_criteria_from_gpt(file_content, programming_languages_map_all_in_repo)

def accumulate_language_data(languages_map_all, repo_languages_map):
    """
    Accumulates the programming language data from multiple repositories.
    
    :param languages_map_all: A map of programming languages used in all repositories, key: name, value: byte.
    :param repo_languages_map: A map of programming languages used in a repository, key: name, value: byte.
    """
    for lang_name in repo_languages_map:
        if lang_name in languages_map_all:
            languages_map_all[lang_name] += repo_languages_map[lang_name]
    else:
        languages_map_all[lang_name] = repo_languages_map[lang_name]


def get_criteria_from_gpt(file_content, languages_map):
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
    for language_name_key in languages_map:
        system_message += language_name_key + "(" + str(languages_map[language_name_key]) + " bytes), "

    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": "Perform your task according to the system message. These are the company's repositories and the file contents." + file_content}
            ]
        )
        content = json.loads(completion.choices[0].message.content)
        return content['criteria']
    except Exception as e:
        raise RuntimeError(f"Error generating criteria with OpenAI API: {e}")


def save_criteria_to_dynamodb(criteria, position_id):
    """
    Saves the generated criteria to the database.
    
    :param criteria: A list of criteria keywords.
    :param position_id: Unique identifier for the position.
    """
    # TODO: Save criteria to database logic here...
    for criterion in criteria:
        id = str(uuid.uuid4())
        created_at = datetime.datetime.now().isoformat()
    return