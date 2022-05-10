# AWS serverless web hosting + contact form
This project is all about an AWS cloudformation template that sets up all the necessary infrastructure for serverless web hosting on AWS, including a contact form. There is also a github action to setup continuous delivery. The stack deploys the following:

- S3 bucket
- Cloudfront distribution
- SSL/TLS certificate
- Route53 record
- AGI gateway, lambda, sns topic for contact form
- Edge lamda for better SEO
- IAM user with permissions to deploy from github actions

The website this stack will deploy is based on [Start Bootstrap - Freelancer](https://github.com/startbootstrap/startbootstrap-freelancer)
The cloudformation template uses the [deploy-to-s3 app](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:375983427419:applications~deploy-to-s3) from the [serverless application repository](https://aws.amazon.com/serverless/serverlessrepo/).

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/riznob/aws-serverless-web-hosting-plus-contact/blob/master/LICENSE)

## Prerequisites
- [AWS account](https://aws.amazon.com/)
- [Hosted zone in Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html)
- [GitHub account](https://github.com)
- Setup reCaptcha v2 here: [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin). Note both the client and server side site keys. See the [recaptcha documentation](https://developers.google.com/recaptcha/docs/invisible) for more details.
- [AWS sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Setup a named profile for sam cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html). Let's assume your named profile is called `sidney`.
- [Node.js v12](https://nodejs.org/en/)
- [Python 3.7](https://www.python.org/)

## Deploying to AWS
There are 2 resources that need to be deployed in us-east-1 region; 1) [SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html#https-requirements-aws-region), and 2) [edge lambda](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-cloudfront-triggers) for SEO. Everything else can be deployed in your region of choice. Therefore, if you want to deploy to any AWS region other than us-east-1, you need to deploy 2 stacks; one stack for the resources that need to be in us-east-1 and another stack in your chosen region. If your region of choice is us-east-1 you need only deploy one stack, and that's a wee bit simpler.

### us-east-1 region only (single stack, recommended)
1. run `./prepare.sh` to pull in the vendor code for the website
1. run `export AWS_PROFILE=sidney`
1. run `sam build`
1. run `sam deploy --guided --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND`

Leave the `EdgeLambdaArn` and `SSLCertificateArn` blank.

### If your region of choice is not us-east-1 (two stacks)
#### Deploy resouces to us-east-1
1. run `./prepare.sh` to pull in the vendor code for the website
1. run `export AWS_PROFILE=sidney`
1. run `sam build -t template-east.yaml`
1. run `sam deploy -t template-east.yaml --guided`
1. Note the output values of `SSLCertificateArn` and `EdgeLambdaArn`
1. run `sam build --use-container`
1. run `sam deploy --guided --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND`, using the output values of the us-east-1 stack as parameters for this stack.
1. Refer to the [Stack Parameters](#stack-parameters) section below.

### Stack Parameters
| Parameter | Description |
| --------- | ----------- |
| Stack Name | Name of the stack |
| AWS Region | Region where stack will be deployed |
| DomainName | Domain name of hosted zone |
| HostedZoneId | HostedZoneId found in Route53 |
| Subject | Subject of the email sent from web form |
| ToEmailAddress | Email address where web form will send emails |
| ReCaptchaClientSecret | Get this from reCaptcha |
| ReCaptchaServerSecret | Get this from reCaptcha |
| EdgeLambdaArn | Not needed if deploying 1 stack to us-east-1 |
| SSLCertificateArn | Not needed if deploying 1 stack to us-east-1 |
| Confirm changes before deploy [y/N]: | N |
| Allow SAM CLI IAM role creation [Y/n]: | Y |
| Disable rollback [y/N]: | N |
| ContactUsFunction may not have authorization defined, Is this okay? [y/N]: | N, Don't worry, we have captcha |
| Save arguments to configuration file [Y/n]: | Y |
| SAM configuration file [samconfig.toml]: | Y |
| SAM configuration environment [default]: | Y |

## GitHub actions continuous delivery
Before you setup github actions, go grab the index.html from your S3 bucket and check it into git. During the deploy of the cloudformation template, the API gateway URL and google reCaptcha client key values were put into that file.

Look at the output of the cloudformation stack to find the `IAMUser`. Then setup [AWS programatic credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) for that user. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, should be [set as encrypted secrets on your github repo](https://docs.github.com/en/actions/reference/encrypted-secrets).

Look at the output of the cloudformation stack to find the `CloudFrontDistributionId` and `S3Bucket`. Edit `.github/workflows/main.yml` with those values. Region too.

## Running the site locally
1. run `cd web`
1. run `npm install`
2. run `gulp`
3. run `gulp dev`

#### Gulp Tasks
- `gulp` the default task that builds everything
- `gulp dev` browserSync opens the project in your default browser and live reloads when changes are made
- `gulp css` compiles SCSS files into CSS and minifies the compiled CSS
- `gulp js` minifies the themes JS file
- `gulp vendor` copies dependencies from node_modules to the vendor directory

NOTE: Delete the web/node_modules directory or the deploy will fail due to too much crap.

## Deleting the stack
When you delete the stack it will probably fail to delete. Don't worry. You need to do two things after the stack fails to delete:
1. Empty the S3 bucket
1. Wait for the edge lambda to undeploy now that your cloudfront distribution had been deleted. Maybe a couple of hours.

After that, try to delete the stack again. It should delete just fine.