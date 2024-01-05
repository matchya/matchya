#!/bin/bash

# Parse command line arguments for bucket name and environment
while (( "$#" )); do
  case "$1" in
    --bucket-name)
      bucket_name="$2"
      shift 2
      ;;
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

if [ "$environment" != "production" ] && [ "$environment" != "staging" ]; then
    if [ -z "$AWS_PROFILE" ]; then
        echo "AWS_PROFILE is not set. Please set it before running this script."
        exit 1
    fi
fi

# Check if bucket name is provided
if [ -z "$bucket_name" ]; then
    echo "Bucket name is not provided. Please provide it as an argument with --bucket-name flag."
    exit 1
fi
echo "Bucket name: $bucket_name"

# Check if environment is provided
if [ -z "$environment" ]; then
    echo "Environment is not provided. Please provide it as an argument with --environment flag."
    exit 1
fi
echo "Environment: $environment"

echo "Get the distribution ID for the CloudFront distribution..."
distribution_id=$(aws ssm get-parameter --name "/terraform/shared/${bucket_name}/cloudfront_distribution_id" --query "Parameter.Value" --output text)
if [ -z "$distribution_id" ]; then
    echo "Distribution ID not found. Exiting without deploying to S3."
    exit 1
fi
echo "Distribution ID found: $distribution_id"

# Check if node_modules directory exists in the web directory
if [ ! -d "$(dirname "$0")/../web/node_modules" ]; then
    echo "node_modules not found in web directory. Installing packages..."
    cd $(dirname "$0")/../web
    if ! npm install; then
        echo "Package installation failed. Exiting without deploying to S3."
        exit 1
    fi
    cd -
fi

echo "Checking if .env file exists in web directory..."
env_file="$(dirname "$0")/../web/.env"
if [ ! -f "$env_file" ]; then
    echo ".env file not found in web directory. Please ensure it exists before building."
    exit 1
fi

echo "Starting build..."
cd $(dirname "$0")/../web
if ! npm run build; then
    echo "Build failed. Exiting without deploying to S3."
    exit 1
fi

echo "Starting deployment to S3..."
aws s3 sync dist/ s3://$bucket_name
echo "Deployment to S3 completed."

echo "Starting CloudFront cache invalidation..."
if ! aws cloudfront create-invalidation --distribution-id $distribution_id --paths "/*" > /dev/null 2>&1; then
    echo "CloudFront cache invalidation failed."
    exit 1
fi
echo "CloudFront cache invalidation was successful."
