#!/bin/bash

# This script builds and deploys the AR Boxing Game serverless application.
# It assumes you have AWS credentials configured in your environment.

echo "Building the SAM application..."
sam build

if [ $? -ne 0 ]; then
  echo "SAM build failed. Please check the error messages above."
  exit 1
fi

echo "Build successful."
echo "Deploying the application to AWS..."

sam deploy \
  --stack-name ar-boxing-game-prod \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --parameter-overrides DynamoDBTableName=ARBoxingGameStates \
  --no-confirm-changeset

if [ $? -ne 0 ]; then
  echo "Deployment failed. Please check the error messages above."
  exit 1
fi

echo "Deployment successful!"
echo "You can find the API Gateway endpoint URL in the outputs of the CloudFormation stack in the AWS console."
