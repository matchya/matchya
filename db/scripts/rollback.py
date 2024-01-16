import subprocess
import logging
import argparse

import boto3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
This script is a Python program designed to automate the process of building a Docker image and running a Liquibase changelog on a database. 
"""


def build_request(rds_endpoint, rds_port, db_name, db_username, db_password):
    changelog_file_name = 'master-changelog.xml'
    return [
        "docker", "run", "--rm",
        "liquibase",
        f"--changeLogFile={changelog_file_name}",
        "--defaultsFile=/liquibase/config/liquibase.properties",
        "--url", f"jdbc:postgresql://{rds_endpoint}:{rds_port}/{db_name}",
        "--username", db_username,
        "--password", db_password
    ]


def rollback_by_count(count, **kwargs):
    """
    Rolls back the database changes by the specified count using Liquibase.

    :param count: The number of changesets to roll back.
    :param kwargs: Additional keyword arguments used in building the Liquibase request.
    """
    request = build_request(**kwargs)
    request.append('rollback-count')
    request.append('--count')
    request.append(str(count))
    try:
        subprocess.run(request, check=True)
    except subprocess.CalledProcessError as e:
        # Handle the error (e.g., log it, raise a different exception, etc.)
        print(f"Error executing rollback: {e}")


def get_ssm_parameter(param_name):
    """
    Retrieves a parameter from AWS Systems Manager (SSM) Parameter Store.
    - param_name: The name of the parameter to be retrieved.
    - It uses AWS SDK (boto3) to communicate with the SSM service.
    - Decrypts and returns the parameter value.
    """
    ssm_client = boto3.client('ssm')
    parameter = ssm_client.get_parameter(Name=param_name, WithDecryption=True)
    return parameter['Parameter']['Value']


def build_docker_image():
    """
    Builds a Docker image using the 'docker build' command.
    - The image is tagged as 'liquibase'.
    - Assumes that a Dockerfile is present in the current directory.
    """
    subprocess.run(["docker", "build", "-t", "liquibase", ".."], check=True)


if __name__ == "__main__":
    """
    Main Execution Block:
    - Retrieves database connection details from AWS SSM Parameter Store.
    - Builds the Docker image.
    - Runs the Liquibase changelog with the retrieved database details.
    """
    parser = argparse.ArgumentParser(description="Rollback database changes by a specified count using Liquibase.")
    parser.add_argument("stage", type=str, help="Stage of the deployment", default='dev')
    parser.add_argument("count", type=int, help="Number of changesets to roll back", default=1)
    args = parser.parse_args()

    kwargs = {}
    kwargs['rds_endpoint'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/endpoint') if args.stage == 'dev' else 'host.docker.internal'
    kwargs['rds_port'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/port') if args.stage == 'dev' else 5433
    kwargs['db_username'] = get_ssm_parameter('/terraform/dev/rds/db_username')
    kwargs['db_password'] = get_ssm_parameter('/terraform/dev/rds/db_password')
    kwargs['db_name'] = args.stage
    logger.info(f'Retrieving SSM params: {kwargs}')

    build_docker_image()
    rollback_by_count(count=args.count, **kwargs)
