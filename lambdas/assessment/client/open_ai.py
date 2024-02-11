# import json
# import os

# from openai import OpenAI
# from utils.logger import Logger

# logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


# class OpenAiClient:
#     def __init__(self):
#         self.chat_client = OpenAI()

#     # TODO: change to context based quiz
#     def _get_system_and_user_message(self, keywords: list, position_type: str, position_level: str):
#         """
#         Gets the system and user message from the keywords.

#         :param keywords: The keywords.
#         """
#         logger.info(f"_get_system_and_user_message: {keywords}, {position_type}, {position_level}")
#         system_message = """
#         You are tasked with creating a set of interview questions for a %s, %s position.
#         You will be provided with a list of topics that should be asked about, as well as a difficulty level for each question (easy, medium, hard).

#         1. **Format Specification**: Structure the response in JSON format. The response must include a list of questions, each represented as a JSON object.
#         use provided topic and difficulty level for each question.

#         2. **Clear Questions**: 
#         When creating a question, consider the evalution points indicated by the metrics and its scoring value. 
#         Read the question and ask it clearly so that the respondent knows which points need to be answered in detail and to what extent.
        
#         3. **The Number of Metrics**:
#         Each question has a list of metrics that are used to evaluate the candidate's response to the question.
#         The number of metrics for each question is at least 2 and at most 4.
#         It depends on the complexity of the question and the number of points that need to be answered.
#         If the question is simple, you can use 2 metrics, if the question is complex, you can use 3 or 4 metrics.
#         No matter how many metrics you use, the total weight of all metrics must be exactly 1.0.

#         4. **Detailed Scoring Metrics**: 
#         THIS IS A VERY IMPORTANT!!
#         scoring metrics are used to evaluate the candidate's response to the question.
#         As in the examples below, be as detailed as possible, use unambiguous in keywords and criteria when creating the scoring metrics.
#         Using something like: "Candidate has good understanding of the topic" is not a good metric. Never use subjective terms like "good", "bad", "excellent", etc.
        
#         5. **Weighted Scoring**:
#         Each question has 10 points. Each metric has a weight that determines how much of the total score the metric is worth.
#         For example, if a question has 2 metrics, each with a weight of 0.5, then each metric is worth 5 points.
#         So, the total of weights for all metrics in a question must be exactly 1.0.

#         Your response must be in the following JSON format like this (here is examples you can refer to, you cannot make any changes in the format, but of course you can (must) change the content):
#         {
#             questions: [
#                 {
#                     "text": "Suppose you have a React component that displays a button. When the button is clicked, it should update the text on the page to 'Button clicked!'. However, the text isn't updating when the button is clicked. What might be causing this issue, and how would you go about fixing it?",
#                     "difficulty": "easy",
#                     "topic": "React",
#                     "metrics": [
#                         {
#                             "name": "Understanding of event handling in React.",
#                             "scoring": "0-2: Candidate does not mention or incorrectly describes the use of event handlers like 'onClick'. No mention of 'setState' or similar functions for updating state;
#                                         3-5: Candidate mentions attaching an event handler like 'onClick' but lacks details on implementation or correctly updating the state. May understand the need for 'setState' but cannot clearly explain its use.;
#                                         6-8: Candidate correctly identifies the need for an 'onClick' event handler and mentions using 'setState' to update the component's state, but the explanation lacks depth or misses minor best practices.;
#                                         9-10: Candidate provides a detailed explanation of attaching 'onClick', using 'setState' to update the state, and clearly understands re-rendering the component. May also mention function binding or arrow functions in event handlers."
#                             "weight": 0.5
#                         },
#                         {
#                             "name": "Knowledge of state and re-rendering.",
#                             "scoring": "0-2: Candidate shows no understanding of 'state' or the component's re-rendering process. No mention of 'setState' or its role in updating the UI.;
#                                         3-5: Candidate understands that state needs to be updated but is vague about how it triggers re-rendering or the correct use of 'setState'. Might understand 'state' is important but can't articulate the connection to UI updates.;
#                                         6-8: Candidate mentions 'setState' and knows it triggers a re-render, but the explanation is basic and may lack specifics on how React batches updates or optimizes renders.;
#                                         9-10: Candidate gives a clear, specific explanation of how 'state' impacts the UI, how 'setState' triggers re-rendering, and discusses React's rendering behavior. May include details on best practices to optimize performance or avoid common mistakes."
#                             "weight": 0.5
#                         }
#                     ]
#                 },
#                 {
#                     "text": "How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.",
#                     "difficulty": "medium", // easy, medium, hard
#                     "topic": "Docker",
#                     "metrics": [
#                         {
#                             "name": "Knowledge of Dockerfile optimization techniques.",
#                             "scoring": "0-2: Candidate fails to mention any Dockerfile optimization techniques or provides incorrect information.;
#                                         3-5: Candidate mentions using a smaller base image or reducing layers but lacks detail on how these impact build time and image size.;
#                                         6-8: Candidate explains techniques like multi-stage builds, minimizing layer count, and perhaps using .dockerignore, but may not fully elaborate on the impact of each.;
#                                         9-10": Candidate provides a comprehensive strategy including multi-stage builds, efficient layering, use of smaller base images, and perhaps even specific instructions for optimizing caching and minimizing build context."
#                             "weight": 0.4
#                         },
#                         {
#                             "name": "Understanding of efficient image construction and management.",
                            
#                             "scoring": "0-2: Candidate does not understand the concepts of image layering or how Docker manages data.;
#                                         3-5: Candidate understands basic concepts like image layering and .dockerignore but cannot elaborate on how these contribute to efficient construction and management.;
#                                         6-8: Candidate discusses effective use of base images, layer caching, and minimizing redundant data but may lack details on advanced strategies for image size management.;
#                                         9-10: Candidate demonstrates advanced understanding, discussing detailed layer management, dynamic data strategies, and how to effectively manage image size for performance and efficiency."
#                             "weight": 0.3
#                         },
#                         {
#                             "name": "Rationale behind optimization choices.",
#                             "scoring": "0-2: Candidate provides no clear rationale for their choices or suggests incorrect reasoning.;
#                                         3-5: Candidate provides basic rationale for some optimizations but lacks depth and may not connect choices to specific outcomes.;
#                                         6-8: Candidate provides solid reasoning for most decisions, showing an understanding of the trade-offs and benefits, but might miss some subtleties.;
#                                         9-10: Candidate provides a comprehensive and strategic rationale for all choices, clearly understanding Docker's best practices, performance implications, and efficiency gains."
#                             "weight": 0.2
#                         },
#                         {
#                             "name": "Awareness of potential pitfalls and best practices.",
#                             "scoring": "0-2: Candidate shows no awareness of potential pitfalls or best practices in Dockerfile optimization.;
#                                         3-5: Candidate recognizes some best practices or pitfalls but cannot articulate specific examples or how to address them.;
#                                         6-8: Candidate identifies several common pitfalls and adheres to known best practices, providing some specific examples and solutions.;
#                                         9-10: Candidate demonstrates deep insight into potential issues and best practices, discussing a range of advanced tips, techniques, and industry-standard practices for avoiding problems and optimizing Dockerfiles."
#                             "weight": 0.1
#                         }
#                     ],
#                 },
#                 {
#                     "text": "Describe your approach to designing a secure, scalable microservices architecture for a high-traffic online platform. Consider aspects like service discovery, load balancing, data consistency, fault tolerance, and security. How would you ensure smooth communication between services while maintaining performance and reliability?",
#                     "difficulty": "hard",
#                     "topic": "Microservices Architecture",
#                     "metrics": [
#                         {
#                             "name": "Designing Scalable and Secure Microservices",
#                             "scoring": "0-2: Candidate lacks understanding of basic microservices principles, cannot articulate a coherent design approach.;
#                                         3-5: Candidate mentions generic microservices concepts like service discovery and load balancing but lacks depth or specific strategies.;
#                                         6-8: Candidate describes a decent strategy for scalability and security, mentioning specific tools or patterns, but may lack detail on implementation or overlook some aspects like data consistency or fault tolerance.;
#                                         9-10: Candidate provides a comprehensive and detailed strategy covering all key aspects including service discovery, load balancing, security, data consistency, and fault tolerance. Discusses trade-offs and best practices.",
#                             "weight": 0.4
#                         },
#                         {
#                             "name": "Ensuring Data Consistency and Fault Tolerance",
#                             "scoring": "0-2: Candidate does not understand the challenges of data consistency and fault tolerance in microservices.;
#                                         3-5: Candidate recognizes data consistency and fault tolerance as challenges but offers only basic or vague solutions.;
#                                         6-8: Candidate proposes solid strategies for ensuring data consistency and fault tolerance, such as database replication strategies or circuit breakers but may not fully address complexities or edge cases.;
#                                         9-10: Candidate demonstrates an in-depth understanding of data consistency and fault tolerance, providing advanced strategies and real-world examples. Discusses specific technologies and patterns like event sourcing, CQRS, or sagas.",
#                             "weight": 0.3
#                         },
#                         {
#                             "name": "Communication and Performance Optimization",
#                             "scoring": "0-2: Candidate fails to address communication between services or how to optimize for performance.;
#                                         3-5: Candidate mentions basic communication protocols like REST or messaging queues but lacks a detailed strategy for performance optimization.;
#                                         6-8: Candidate provides a good strategy for inter-service communication, discussing REST, gRPC, or message brokers. Mentions performance optimization techniques but may not provide a holistic approach.;
#                                         9-10: Candidate presents an advanced and integrated approach to service communication and performance optimization, discussing the trade-offs of different protocols and how to leverage caching, asynchronous communication, and other techniques for high performance.",
#                             "weight": 0.2
#                         },
#                         {
#                             "name": "Security Considerations",
#                             "scoring": "0-2: Candidate shows little to no awareness of security considerations in a microservices architecture.;
#                                         3-5: Candidate recognizes the importance of security but can only discuss generic or superficial measures.;
#                                         6-8: Candidate suggests solid security practices like using API gateways, service meshes, or encryption but might lack depth in how to implement them effectively across a microservices architecture.;
#                                         9-10: Candidate demonstrates a deep understanding of security challenges specific to microservices and provides a comprehensive strategy, including authentication, authorization, secure communication, and secrets management. Discusses industry-standard tools and best practices.",
#                             "weight": 0.1
#                         }
#                     ]
#                 },
#                 // more questions...
#             ]
#         """ % ((position_level + ' level'), position_type)

#         user_message = "Here are the topics and difficulties for the questions, create %d questions from the keywords\n" % len(keywords)
#         user_message = "Use the same topic name for json response.\n"
#         for keyword in keywords:
#             user_message += "Topic: %s, Difficulty: %s\n" % (keyword['topic'], keyword['difficulty'])

#         return system_message, user_message

#     # TODO: not used
#     def generate_questions(self, keywords, position_type, position_level) -> list:
#         """
#         Gets the questions from GPT.

#         :param system_message: The system message.
#         :param user_message: The user message.

#         :return: A list of questions.
#         """
#         logger.info(f"generate_questions: {keywords}, {position_type}, {position_level}")
#         system_message, user_message = self._get_system_and_user_message(keywords, position_type, position_level)
#         try:
#             completion = self.chat_client.chat.completions.create(
#                 model="gpt-3.5-turbo-1106",
#                 response_format={"type": "json_object"},
#                 messages=[
#                     {"role": "system", "content": system_message},
#                     {"role": "user", "content": user_message}
#                 ],
#                 temperature=0.5
#             )
#             logger.info('completion: %s' % completion)
#             content = json.loads(completion.choices[0].message.content)
#             logger.info(f"content: {content}")
#             logger.info(f"questions generated: {content['questions']}")
#             return content['questions']
#         except Exception as e:
#             logger.error(f"Error generating criteria with OpenAI API: {e}")
#             raise RuntimeError("Error generating criteria with OpenAI API")
