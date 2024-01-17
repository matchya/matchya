import os
import subprocess
import logging
import argparse
import sys

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
    # Get the root directory of your project
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(sys.argv[0])))

    # Construct the absolute path to the 'db' directory
    db_dir = os.path.join(root_dir)
    subprocess.run(["docker", "build", "-t", "liquibase", db_dir], check=True)


def build_request(rds_endpoint, rds_port, db_name, db_username, db_password):
    changelog_file_name = 'master-changelog.xml'
    return [
        "docker", "run", "--network=host", "--rm",
        "liquibase",
        "--defaultsFile=/liquibase/config/liquibase.properties",
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
    parser = argparse.ArgumentParser(description="Run Liquibase changelog on a database")
    parser.add_argument("stage", type=str, help="Stage of the deployment", default='dev')
    args = parser.parse_args()

    kwargs = {}

    kwargs['rds_endpoint'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/endpoint') if args.stage == 'dev' else 'localhost'
    kwargs['rds_port'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/port') if args.stage == 'dev' else 5433
    kwargs['db_username'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/db_username')
    kwargs['db_password'] = get_ssm_parameter(f'/terraform/{args.stage}/rds/db_password')
    kwargs['db_name'] = args.stage
    logger.info(f'Retrieving SSM params: {kwargs}')

    build_docker_image()
    run_changelog(**kwargs)
