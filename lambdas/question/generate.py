import json
import uuid
import logging

import boto3
import psycopg2
from openai import OpenAI

from config import Config

# Logger
logger = logging.getLogger('publish_question_generation')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)

logger.propagate = False

# DynamoDB
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
criterion_table = dynamodb.Table(f'{Config.ENVIRONMENT}-Criterion')

# Postgres
db_conn = None
db_cursor = None

# OpenAI
chat_client = OpenAI()


def connect_to_db():
    """
    Reconnects to the database.
    """
    logger.info("Connecting to the db...")
    global db_conn
    global db_cursor
    if not db_conn or db_conn.closed:
        db_conn = psycopg2.connect(host=Config.POSTGRES_HOST, database=Config.POSTGRES_DB, user=Config.POSTGRES_USER, password=Config.POSTGRES_PASSWORD)
    db_cursor = db_conn.cursor()


def get_keywords_from_position_type_and_level(position_type: str, position_level: str, n_questions: int) -> list:
    """
    Gets the keywords from the position type and level.

    :param position_type: The position type.
    :param position_level: The position level.
    :param n_questions: The number of questions to generate.
    :return: A list of keywords.
    """
    logger.info("Getting the keywords from the position type and level...")
    # Mocked keywords
    keywords = [
        {'topic': 'React', 'difficulty': 'easy'},
        {'topic': 'Docker', 'difficulty': 'medium'},
        {'topic': 'Microservices Architecture', 'difficulty': 'hard'},
        {'topic': 'AWS', 'difficulty': 'medium'},
        {'topic': 'SQL', 'difficulty': 'easy'},
        {'topic': 'Python', 'difficulty': 'medium'}
    ]
    return keywords


def get_system_and_user_message(keywords: list, position_type: str, position_level: str):
    """
    Gets the system and user message from the keywords.

    :param keywords: The keywords.
    """
    logger.info("Getting the system and user message...")
    system_message = """
    You are tasked with creating a set of interview questions for a %s, %s position.
    You will be provided with a list of topics that should be asked about, as well as a difficulty level for each question (easy, medium, hard).

    1. **Format Specification**: Structure the response in JSON format. The response must include a list of questions, each represented as a JSON object.
    use provided topic and difficulty level for each question.

    2. **Clear Questions**: 
    When creating a question, consider the evalution points indicated by the metrics and its scoring value. 
    Read the question and ask it clearly so that the respondent knows which points need to be answered in detail and to what extent.

    3. **Detailed Scoring Metrics**: 
    THIS IS A VERY IMPORTANT!!
    scoring metrics are used to evaluate the candidate's response to the question.
    As in the examples below, be as detailed as possible, use unambiguous in keywords and criteria when creating the scoring metrics.
    Using something like: "Candidate has good understanding of the topic" is not a good metric. Never use subjective terms like "good", "bad", "excellent", etc.
    
    4. **Weighted Scoring**:
    Each question has 10 points. Each metric has a weight that determines how much of the total score the metric is worth.
    For example, if a question has 2 metrics, each with a weight of 0.5, then each metric is worth 5 points.
    So, the total of weights for all metrics in a question must be exactly 1.0.

    Your response must be in the following JSON format like this (here is examples you can refer to, you cannot make any changes in the format, but of course you can (must) change the content):
    {
        questions: [
            {
                "text": "Suppose you have a React component that displays a button. When the button is clicked, it should update the text on the page to 'Button clicked!'. However, the text isn't updating when the button is clicked. What might be causing this issue, and how would you go about fixing it?",
                "difficulty": "easy",
                "topic": "React",
                "metrics": [
                    {
                        "name": "Understanding of event handling in React.",
                        "scoring": "0-2: Candidate does not mention or incorrectly describes the use of event handlers like 'onClick'. No mention of 'setState' or similar functions for updating state;
                                    3-5: Candidate mentions attaching an event handler like 'onClick' but lacks details on implementation or correctly updating the state. May understand the need for 'setState' but cannot clearly explain its use.;
                                    6-8: Candidate correctly identifies the need for an 'onClick' event handler and mentions using 'setState' to update the component's state, but the explanation lacks depth or misses minor best practices.;
                                    9-10: Candidate provides a detailed explanation of attaching 'onClick', using 'setState' to update the state, and clearly understands re-rendering the component. May also mention function binding or arrow functions in event handlers."
                        "weight": 0.5
                    },
                    {
                        "name": "Knowledge of state and re-rendering.",
                        "scoring": "0-2: Candidate shows no understanding of 'state' or the component's re-rendering process. No mention of 'setState' or its role in updating the UI.;
                                    3-5: Candidate understands that state needs to be updated but is vague about how it triggers re-rendering or the correct use of 'setState'. Might understand 'state' is important but can't articulate the connection to UI updates.;
                                    6-8: Candidate mentions 'setState' and knows it triggers a re-render, but the explanation is basic and may lack specifics on how React batches updates or optimizes renders.;
                                    9-10: Candidate gives a clear, specific explanation of how 'state' impacts the UI, how 'setState' triggers re-rendering, and discusses React's rendering behavior. May include details on best practices to optimize performance or avoid common mistakes."
                        "weight": 0.5
                    }
                ]
            },
            {
                "text": "How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.",
                "difficulty": "medium", // easy, medium, hard
                "topic": "Docker",
                "metrics": [
                    {
                        "name": "Knowledge of Dockerfile optimization techniques.",
                        "scoring": "0-2: Candidate fails to mention any Dockerfile optimization techniques or provides incorrect information.;
                                    3-5: Candidate mentions using a smaller base image or reducing layers but lacks detail on how these impact build time and image size.;
                                    6-8: Candidate explains techniques like multi-stage builds, minimizing layer count, and perhaps using .dockerignore, but may not fully elaborate on the impact of each.;
                                    9-10": Candidate provides a comprehensive strategy including multi-stage builds, efficient layering, use of smaller base images, and perhaps even specific instructions for optimizing caching and minimizing build context."
                        "weight": 0.4
                    },
                    {
                        "name": "Understanding of efficient image construction and management.",
                        
                        "scoring": "0-2: Candidate does not understand the concepts of image layering or how Docker manages data.;
                                    3-5: Candidate understands basic concepts like image layering and .dockerignore but cannot elaborate on how these contribute to efficient construction and management.;
                                    6-8: Candidate discusses effective use of base images, layer caching, and minimizing redundant data but may lack details on advanced strategies for image size management.;
                                    9-10: Candidate demonstrates advanced understanding, discussing detailed layer management, dynamic data strategies, and how to effectively manage image size for performance and efficiency."
                        "weight": 0.3
                    },
                    {
                        "name": "Rationale behind optimization choices.",
                        "scoring": "0-2: Candidate provides no clear rationale for their choices or suggests incorrect reasoning.;
                                    3-5: Candidate provides basic rationale for some optimizations but lacks depth and may not connect choices to specific outcomes.;
                                    6-8: Candidate provides solid reasoning for most decisions, showing an understanding of the trade-offs and benefits, but might miss some subtleties.;
                                    9-10: Candidate provides a comprehensive and strategic rationale for all choices, clearly understanding Docker's best practices, performance implications, and efficiency gains."
                        "weight": 0.2
                    },
                    {
                        "name": "Awareness of potential pitfalls and best practices.",
                        "scoring": "0-2: Candidate shows no awareness of potential pitfalls or best practices in Dockerfile optimization.;
                                    3-5: Candidate recognizes some best practices or pitfalls but cannot articulate specific examples or how to address them.;
                                    6-8: Candidate identifies several common pitfalls and adheres to known best practices, providing some specific examples and solutions.;
                                    9-10: Candidate demonstrates deep insight into potential issues and best practices, discussing a range of advanced tips, techniques, and industry-standard practices for avoiding problems and optimizing Dockerfiles."
                        "weight": 0.1
                    }
                ],
            },
            {
                "text": "Describe your approach to designing a secure, scalable microservices architecture for a high-traffic online platform. Consider aspects like service discovery, load balancing, data consistency, fault tolerance, and security. How would you ensure smooth communication between services while maintaining performance and reliability?",
                "difficulty": "hard",
                "topic": "Microservices Architecture",
                "metrics": [
                    {
                        "name": "Designing Scalable and Secure Microservices",
                        "scoring": "0-2: Candidate lacks understanding of basic microservices principles, cannot articulate a coherent design approach.;
                                    3-5: Candidate mentions generic microservices concepts like service discovery and load balancing but lacks depth or specific strategies.;
                                    6-8: Candidate describes a decent strategy for scalability and security, mentioning specific tools or patterns, but may lack detail on implementation or overlook some aspects like data consistency or fault tolerance.;
                                    9-10: Candidate provides a comprehensive and detailed strategy covering all key aspects including service discovery, load balancing, security, data consistency, and fault tolerance. Discusses trade-offs and best practices.",
                        "weight": 0.4
                    },
                    {
                        "name": "Ensuring Data Consistency and Fault Tolerance",
                        "scoring": "0-2: Candidate does not understand the challenges of data consistency and fault tolerance in microservices.;
                                    3-5: Candidate recognizes data consistency and fault tolerance as challenges but offers only basic or vague solutions.;
                                    6-8: Candidate proposes solid strategies for ensuring data consistency and fault tolerance, such as database replication strategies or circuit breakers but may not fully address complexities or edge cases.;
                                    9-10: Candidate demonstrates an in-depth understanding of data consistency and fault tolerance, providing advanced strategies and real-world examples. Discusses specific technologies and patterns like event sourcing, CQRS, or sagas.",
                        "weight": 0.3
                    },
                    {
                        "name": "Communication and Performance Optimization",
                        "scoring": "0-2: Candidate fails to address communication between services or how to optimize for performance.;
                                    3-5: Candidate mentions basic communication protocols like REST or messaging queues but lacks a detailed strategy for performance optimization.;
                                    6-8: Candidate provides a good strategy for inter-service communication, discussing REST, gRPC, or message brokers. Mentions performance optimization techniques but may not provide a holistic approach.;
                                    9-10: Candidate presents an advanced and integrated approach to service communication and performance optimization, discussing the trade-offs of different protocols and how to leverage caching, asynchronous communication, and other techniques for high performance.",
                        "weight": 0.2
                    },
                    {
                        "name": "Security Considerations",
                        "scoring": "0-2: Candidate shows little to no awareness of security considerations in a microservices architecture.;
                                    3-5: Candidate recognizes the importance of security but can only discuss generic or superficial measures.;
                                    6-8: Candidate suggests solid security practices like using API gateways, service meshes, or encryption but might lack depth in how to implement them effectively across a microservices architecture.;
                                    9-10: Candidate demonstrates a deep understanding of security challenges specific to microservices and provides a comprehensive strategy, including authentication, authorization, secure communication, and secrets management. Discusses industry-standard tools and best practices.",
                        "weight": 0.1
                    }
                ]
            },
            // more questions...
        ]
    """ % ((position_level + 'level'), position_type)

    user_message = "Here are the topics and difficulties for the questions, create %d questions from the keywords\n" % len(keywords)
    for keyword in keywords:
        user_message += "Topic: %s, Difficulty: %s\n" % (keyword['topic'], keyword['difficulty'])

    return system_message, user_message


def get_questions_from_gpt(system_message: str, user_message: str) -> list:
    """
    Gets the questions from GPT.

    :param system_message: The system message.
    :param user_message: The user message.

    :return: A list of questions.
    """
    logger.info("Getting the questions from GPT...")
    try:
        completion = chat_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5
        )
        content = json.loads(completion.choices[0].message.content)
        logger.info(f"questions generated: {content['questions']}")
        return content['questions']
    except Exception as e:
        logger.error(f"Error generating criteria with OpenAI API: {e}")
        raise RuntimeError("Error generating criteria with OpenAI API")


def save_questions_to_db(position_id: str, questions: list) -> str:
    """
    Saves the questions to the database.

    :param position_id: Unique identifier for the position.
    :param questions: The questions to save.

    """
    logger.info("Saving questions to the database...")
    save_data_to_question_table(position_id, questions)
    save_data_to_position_question_table(position_id, questions)
    save_data_to_metric_table(questions)
    logger.info("Questions saved successfully")


def save_data_to_question_table(position_id: str, questions: list) -> str:
    logger.info("Saving questions to the question table...")
    sql = "INSERT INTO question (id, text, difficulty, topic) VALUES"
    try:
        for question in questions:
            id = str(uuid.uuid4())
            text = question['text'].replace("'", "''")
            topic = question['topic'].replace("'", "''")
            question['id'] = id
            sql += f" ('{id}', '{text}', '{question['difficulty']}', '{topic}'),"
        sql = sql[:-1] + ';'
        db_cursor.execute(sql)

    except Exception as e:
        logger.error(f"Error saving questions to question table: {e}")
        raise RuntimeError("Error saving questions to question table")


def save_data_to_position_question_table(position_id: str, questions: list) -> str:
    """
    Saves the questions to the position_question table.

    :param position_id: Unique identifier for the position.
    :param questions: The questions to save.
    """

    logger.info("Saving questions to the position_question table...")
    sql = "INSERT INTO position_question (id, position_id, question_id) VALUES "
    try:
        for question in questions:
            id = str(uuid.uuid4())
            sql += f" ('{id}', '{position_id}', '{question['id']}'),"
        sql = sql[:-1] + ';'
        db_cursor.execute(sql)
    except Exception as e:
        logger.error(f"Error saving questions to position_question table: {e}")
        raise RuntimeError("Error saving questions to position_question table")


def save_data_to_metric_table(questions: list) -> str:
    """
    Saves the questions to the metric table.

    :param position_id: Unique identifier for the position.
    :param questions: The questions to save.
    """
    logger.info("Saving questions to the metric table...")
    sql = "INSERT INTO metric (id, question_id, name, scoring, weight) VALUES "
    try:
        for question in questions:
            for metric in question['metrics']:
                metric_id = str(uuid.uuid4())
                name = metric['name'].replace("'", "''")
                scoring = metric['scoring'].replace("'", "''")
                sql += f" ('{metric_id}', '{question['id']}', '{name}', '{scoring[0: 1023]}', {metric['weight']}),"
        sql = sql[:-1] + ';'
        db_cursor.execute(sql)
    except Exception as e:
        logger.error(f"Error saving questions to metric table: {e}")
        raise RuntimeError("Error saving questions to metric table")


def update_generation_status(position_id: str, question_status='failed'):
    """
    Updates the generation status of the position.

    :param position_id: Unique identifier for the position.
    :param question_status: The status of the question.
    """
    logger.info("Updating the generation status...")
    sql = f"SELECT question_generation_status FROM position WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        if result and result[0]:
            current_status = result[0]
        else:
            current_status = None
    except Exception as e:
        logger.error(f"Error getting generation status from postgres: {e}")
        raise RuntimeError("Error getting generation status from postgres")

    if current_status is None or current_status != 'scheduled':
        logger.info(f"Generation status is not scheduled, nothing to update. status: {current_status}")
        return

    sql = f"UPDATE position SET question_generation_status = '{question_status}' WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        db_conn.commit()
    except Exception as e:
        logger.error(f"Error updating generation status in postgres: {e}")
        raise RuntimeError("Error updating generation status in postgres")


def get_position_type_and_level(position_id: str) -> tuple:
    """
    Gets the position type from the position id.

    :param position_id: Unique identifier for the position.
    :return: The position type and level.
    """
    logger.info("Getting the position type from position id...")
    sql = f"SELECT type, level FROM position WHERE id = '{position_id}';"
    try:
        db_cursor.execute(sql)
        result = db_cursor.fetchone()
        if result and result[0]:
            return result[0], result[1]
        else:
            return None
    except Exception as e:
        logger.error(f"Error getting position type from postgres: {e}")
        raise RuntimeError(f"Error getting position type from postgres: {e}")


def handler(event, context):
    """
    Lambda handler.

    :param event: The event data.
    :param context: The context data.
    """
    logger.info(event)
    try:
        logger.info('Received generate questions request')
        connect_to_db()
        question_status = 'failed'

        messages = event['Records']
        body = json.loads(messages[0]['body'])
        position_id = body.get('position_id')

        n_questions = 6

        position_type, position_level = get_position_type_and_level(position_id)
        # If GitHub is linked, get keywords from GitHub repo
        keywords: list = get_keywords_from_position_type_and_level(position_type, position_level, n_questions)

        system_message, user_message = get_system_and_user_message(keywords, position_type, position_level)
        questions = get_questions_from_gpt(system_message, user_message)

        save_questions_to_db(position_id, questions)

        question_status = 'succeeded'
        logger.info('Questions saved successfully')

    except (ValueError, RuntimeError) as e:
        status_code = 400
        logger.error(f'Questions generation failed (status {str(status_code)}): {e}')
    except Exception as e:
        status_code = 500
        logger.error(f'Questions generation failed (status {str(status_code)}): {e}')
    finally:
        update_generation_status(position_id, question_status)
        if db_cursor:
            db_cursor.close()
        if db_conn:
            db_conn.close()
