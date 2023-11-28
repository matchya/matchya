import logging

import boto3

from config import Config

from utils.response import generate_success_response, generate_error_response
from utils.request import parse_request_parameter

# Logger
logger = logging.getLogger('retrieve criteria')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
CRITERION_TABLE_NAME = f'{Config.ENVIRONMENT}-Criterion'
criterion_table = dynamodb.Table(CRITERION_TABLE_NAME)


def handler(event, context):
    try:
        logger.info(f"Received event: {event}")
        checklist_id = parse_request_parameter(event, 'id')
        criteria = get_criteria_by_checklist_id(checklist_id)
        body = {
            "criteria": criteria,
        }
        logger.info(f"Successfully retrieved criteria")
        return generate_success_response(body)
    except (ValueError, RuntimeError) as e:
        logger.error(f"Failed to retrieve criteria: {e}")
        return generate_error_response(400, f"Failed to retrieve criteria: {e}")
    except Exception as e:
        logger.error(f"Failed to retrieve criteria: {e}")
        return generate_error_response(500, f"Failed to retrieve criteria: {e}")


def get_criteria_by_checklist_id(checklist_id):
    """
    Retrieves the 'message' attribute of criteria for a given checklist_id from the database.
    
    :param checklist_id: The checklist_id to retrieve criteria for.
    :return: List of messages for the given checklist_id.
    """
    try:
        response = criterion_table.query(
            IndexName='ChecklistIdIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('checklist_id').eq(checklist_id),
            ProjectionExpression='message'
        )
        messages = [item['message'] for item in response.get('Items', [])]
        if not messages:
            raise ValueError(f"Criteria not found for checklist_id: {checklist_id}")
        return messages
    except Exception as e:
        raise RuntimeError(f"Failed to retrieve criteria messages: {e}")
