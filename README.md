# serverless
# Serverless Application to develop on AWS Lambda with SNS

## Prerequisites

- AWS SDK
- DynamoDB
- AWS Lambda in your infrastructure

## Build and deploy instructions

- You should have DynamoDb table and AWS lambda created using your terraform
- Clone this repo and make sure you have correct credentials and configuration in Github actions
- Make sure your lambda function is deployed through the update cli command
- This lambda is subscribed to SNS and will publish to SES and DynamoDB

[WebApp Readme](https://github.com/pimples-fall2020/webapp)