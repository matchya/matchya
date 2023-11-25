import json
import uuid

from openai import OpenAI

from client.github import GithubClient
from utils.response import generate_response, generate_success_response
from utils.request import parse_request_body, validate_request_body

chat_client = OpenAI()

def handler(event, context):
    """
    Main entry point for the Lambda function.

    :param event: The event object containing details about the Lambda call, such as input parameters.
    :param context: Lambda runtime information object.
    :return: A dictionary with status code and the candidate's evaluation result in JSON format.
    """
    try:
        body = parse_request_body(event)
        validate_request_body(body, ['position_id', 'candidate_github_username'])
        save_candidate_info_to_db(body)

        position_id = body.get('position_id')
        github_username = body.get('candidate_github_username')
        github_client = GithubClient(github_username)

        criteria = get_criteria_from_dynamodb(position_id)
        pinned_repositories = github_client.get_pinned_repositories_name()
        candidate_result = evaluate_candidate(github_client, pinned_repositories, criteria)

        save_candidate_result_to_db(candidate_result)
        return generate_success_response(candidate_result)
    except Exception as e:
        print(e)
        return generate_response(500, json.dumps({"message": "Evaluation failed."}))


def save_candidate_info_to_db(body):
    """
    Saves candidate information to database.

    :param position_id: The ID of the job position.
    :param github_username: The GitHub username of the candidate.
    """
    id = str(uuid.uuid4())
    first_name = body.get('candidate_first_name', '')
    last_name = body.get('candidate_last_name', '')
    github_username = body.get('candidate_github_username')
    email = body.get('candidate_email', '')
    # TODO: Store Candidate Information in DB (Candidate)
    return

def get_criteria_from_dynamodb(position_id):
    """
    Retrieves the full message criteria for a job position.

    :param position_id: The ID of the job position.
    :return: A list of criteria with keywords and message
    """
    # TODO: Get Criteria keywords and message by Position ID from Database
    criteria = [
        {"keywords": ["Python", "API"], "message": "Ability to build API using Python"},
        {"keywords": ["React", "JavaScript"], "message": "Ability to build web application using React and JavaScript"},
        {"keywords": ["Docker", "Kubernetes"], "message": "Ability to build and deploy application using Docker and Kubernetes"},
    ]

    return criteria


def evaluate_candidate(github_client: GithubClient, repository_names, criteria):
    """
    Generates criteria from GitHub repositories.
    
    :param github_client: A GitHub client object.
    :param repository_names: A list of repository names.
    :return: A list of criteria.
    """
    try:
        contents_and_languages = github_client.get_multi_repo_contents_and_languages(repository_names)
    except Exception as e:
        raise RuntimeError(f"Error Reading files: {e}")

    return get_candidate_evaluation_from_gpt(criteria, contents_and_languages['file_content'], contents_and_languages['languages'])


def get_candidate_evaluation_from_gpt(criteria, file_content, languages):
    """
    Evaluates a candidate's GitHub repository contents against specified criteria using ChatGPT.

    :param criteria_full_messages: A list of criteria messages.
    :param repos_content: Content from the candidate's GitHub repositories.
    :return: A JSON object representing the candidate's evaluation scores and reasons, based on the criteria.
    """
    system_message = "A company is looking for promising employees as software engineers. Candidates need to have a skillset to work on the company's project in terms of programming languages and other technologies. These are criteria that the company needs candidates to have. You need to assess candidates on each criteria with keywords and a message : "

    for i in range(len(criteria)):
        criterion = criteria[i]
        system_message += "\n" + "criterion" + str(i+1) + ". " + criterion["message"] + " (keywords: " + ", ".join(criterion["keywords"]) + ")"

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
                    "criterion": string, // criterion's message
                    "score": number, // score from 0 to 10
                    "reason": string // reason for the score
                },
                {
                }, ... // other criteria
            ]
        }
    """

    message_about_languages = "\nHere is the list of programming languages this candidate used. If you can use this as helpful information, use it:"
    for key, value in languages:
        message_about_languages += key + "(" + str(value) + " bytes), "

    completion = chat_client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": "Follow system message instruction. Here are the files from the candidate's GitHub Account: " + file_content + message_about_languages}
        ]
    )
    candidate_score = json.loads(completion.choices[0].message.content)
    return candidate_score


def save_candidate_result_to_db(candidate_result):
    """
    Saves candidate evaluation result to database.

    :param candidate_result: The candidate's evaluation result.
    """
    # TODO: Store data in DB (CandidateResult, AssessmentCriteria)
    return