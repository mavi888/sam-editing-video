# AWS SAM - Adding a Watermark to a Video

_Infrastructure as code framework used_: AWS SAM
_AWS Services used_: AWS Lambda, S3

## Summary of the demo

In this demo you will see:

- How to increase the ephemeral storage of your Lambda function
- How to add watermark to a video using ffmpeg

This demo is part of a video posted in FooBar Serverless channel. You can check the video to see the whole demo.

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the AWS Pricing page for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

## Requirements

- AWS CLI already configured with Administrator permission
- AWS SAM CLI installed - minimum version 1.43.0 (sam --version)
- NodeJS 14.x installed

## Deploy this demo

Deploy [this layer](https://serverlessrepo.aws.amazon.com/#!/applications/us-east-1/145266761615/ffmpeg-lambda-layer) from the Serverless Application Repository in your account in the region you want to deploy this app.

Save the ARN of the deployed layer as you will need it.

We will be using AWS SAM and make sure you are running the latest version - at the time of writing, this was 1.43.0 (sam --version).

Then you can deploy the project to the cloud:

```
sam deploy -g # Guided deployments
```

When deploying the project you will get asked for the Layer ARN, input it now.
Then you can complete the deployment.

Next times, when you update the code, you can build and deploy with:

```
sam deploy
```

To delete the app:

```
sam delete
```

After deploying the infra, you need to add a watermark file to the Source bucket so the watermark works. In the example folder you can get one image that works.

## Links related to this code

- Video with more details: Soon...
- [Launch blog post](https://aws.amazon.com/blogs/compute/using-larger-ephemeral-storage-for-aws-lambda/)
