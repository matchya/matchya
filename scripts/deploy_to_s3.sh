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

# Setting AWS configuration
if [ "$environment" != "production" ]; then
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

# Check if environment is provided
if [ -z "$environment" ]; then
    echo "Environment is not provided. Please provide it as an argument with --environment flag."
    exit 1
fi

# Get the distribution id from SSM parameter
distribution_id=$(aws ssm get-parameter --name "/terraform/shared/${environment}/www/cloudfront_distribution_id" --query "Parameter.Value" --output text)
if [ -z "$distribution_id" ]; then
    echo "Distribution ID not found. Exiting without deploying to S3."
    exit 1
fi
echo "Distribution ID found: $distribution_id"

# Build the UI bundle
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
