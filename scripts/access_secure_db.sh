#!/bin/bash

# This script is used to access the staging/production databases locally.
# This should be run on a seperate terminal after running the create_ssh_tunnel.sh script on a seperate terminal.

# Parse command line arguments for bucket name and environment
while (( "$#" )); do
  case "$1" in
    --environment)
      environment="$2"
      shift 2
      ;;
    *)
      echo "Invalid option: $1" 1>&2
      exit 1
      ;;
  esac
done

# Check if the AWS profile is set, unless the environment is 'staging' or 'production'
if [[ "$environment" != "staging" && "$environment" != "production" ]]; then
    if [ -z "$AWS_PROFILE" ]; then
        echo "AWS_PROFILE is not set. Please set it before running this script."
        exit 1
    fi
fi

local_port=5433
host=localhost

echo "Fetching rds username for ${environment}..."
username=$(aws ssm get-parameter --name "/terraform/${environment}/rds/db_username" --query "Parameter.Value" --output text)

echo "Fetching rds password for ${environment}..."
password=$(aws ssm get-parameter --name "/terraform/${environment}/rds/db_password" --with-decryption --query "Parameter.Value" --output text)

echo "Accessing ${environment} database..."
PGPASSWORD=$password psql -h $host -p $local_port -U $username -d ${environment}
