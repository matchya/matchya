import subprocess
import logging

import boto3

logger = logging.getLogger('setup')
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s:%(name)s:%(levelname)s:%(message)s')
ch = logging.StreamHandler()
ch.setFormatter(formatter)

logger.addHandler(ch)

"""
This script is a Python program designed to automate the process of building a Docker image and running a Liquibase changelog on a database. 
"""


def run_changelog(**kwargs):
    """
    Runs the Liquibase changelog using a Docker container.
    - The Docker image 'liquibase' is used.
    - Database connection details (endpoint, port, database name, username, password) 
      are passed as arguments.
    - Executes Liquibase 'update' command for the specified changelog file.
    """
    request = build_request(**kwargs)
    request.append("update")
    subprocess.run(request, check=True)


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


def build_request(rds_endpoint, rds_port, db_name, db_username, db_password):
    changelog_file_name = 'master-changelog.xml'
    return [
        "docker", "run", "--rm",
        "liquibase",
        f"--changeLogFile={changelog_file_name}",
        "--url", f"jdbc:postgresql://{rds_endpoint}:{rds_port}/{db_name}",
        "--username", db_username,
        "--password", db_password
    ]


if __name__ == "__main__":
    """
    Main Execution Block:
    - Retrieves database connection details from AWS SSM Parameter Store.
    - Builds the Docker image.
    - Runs the Liquibase changelog with the retrieved database details.
    """
    kwargs = {}
    kwargs['rds_endpoint'] = get_ssm_parameter('/terraform/dev/rds/endpoint')
    kwargs['rds_port'] = get_ssm_parameter('/terraform/dev/rds/port')
    kwargs['db_username'] = get_ssm_parameter('/terraform/dev/rds/db_username')
    kwargs['db_password'] = get_ssm_parameter('/terraform/dev/rds/db_password')
    kwargs['db_name'] = get_ssm_parameter('/terraform/dev/rds/db_name')

    logger.info(f'Retrieving SSM params: {kwargs}')

    build_docker_image()
    run_changelog(**kwargs)
