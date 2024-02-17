resource "aws_iam_role" "github_actions_user_role" {
  name = "github_user_actions_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ],
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${var.account_id}:root"
        },
      },
    ]
  })
}

resource "aws_iam_policy" "deploy_infrastructure_policy" {
  name        = "DeployInfrastructurePolicy"
  description = "Policy for GitHub Actions to deploy infrastructure"
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Sid"    = "SSMParameterStorePermissions",
        "Effect" = "Allow",
        "Action" = [
          "ssm:GetParameter",
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "DynamoDBPermissions",
        "Effect" = "Allow",
        "Action" = [
          "dynamodb:DescribeTable",
          "dynamodb:DescribeContinuousBackups",
          "dynamodb:DescribeTimeToLive",
          "dynamodb:ListTagsOfResource",
          "dynamodb:UpdateTable",
          "dynamodb:DeleteTable"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "RDSPermissions",
        "Effect" = "Allow",
        "Action" = [
          "rds:DescribeDBSubnetGroups",
          "rds:DescribeDBInstances",
          "rds:ListTagsForResource",
          "rds:ModifyDBInstance"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "SQSPermissions",
        "Effect" = "Allow",
        "Action" = [
          "sqs:GetQueueAttributes",
          "sqs:ListQueueTags",
          "sqs:CreateQueue"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "ApiGatewayPermissions",
        "Effect" = "Allow",
        "Action" = [
          "apigateway:GET",
          "apigateway:PUT"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "SESPermissions",
        "Effect" = "Allow",
        "Action" = [
          "ses:*"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "EC2Permissions",
        "Effect" = "Allow",
        "Action" = [
          "ec2:CreateVpcEndpoint",
          "ec2:CreateTags"
        ],
        "Resource" = "*"
      },
      {
        "Sid": "IAmPermissions",
        "Effect" = "Allow",
        "Action" = [
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
        ],
        "Resource" = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "deploy_lambda_policy" {
  name        = "DeployLambdaPolicy"
  description = "Policy to deploy Lambda functions"
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Sid"    = "LambdaPermissions",
        "Effect" = "Allow",
        "Action" = [
          "lambda:*"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "ECRPermissions",
        "Effect" = "Allow",
        "Action" = [
          "ecr:*"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "CloudformationPermissions",
        "Effect" = "Allow",
        "Action" = [
          "cloudformation:*"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "CloudwatchLogsPermissions",
        "Effect" = "Allow",
        "Action" = [
          "logs:CreateLogGroup",
          "logs:TagResource",
          "logs:DeleteLogGroup"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "ApiGatewayPermissions",
        "Effect" = "Allow",
        "Action" = [
          "apigateway:*"
        ],
        "Resource" = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "deploy_website_policy" {
  name        = "DeployWebsitePolicy"
  description = "Policy to deploy website"
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Sid"    = "ACMPermissions",
        "Effect" = "Allow",
        "Action" = [
          "acm:DescribeCertificate",
          "acm:ListCertificates",
          "acm:GetCertificate",
          "acm:ListTagsForCertificate",
          "acm:GetAccountConfiguration"
        ],
        "Resource" = "*"
      },
      {
        "Sid"    = "CloudfrontPermissions",
        "Effect" = "Allow",
        "Action" = [
          "cloudfront:*"
        ],
        "Resource" = "*"
      },
      {
        "Sid" : "Route53Permissions",
        "Effect" = "Allow",
        "Action" = [
          "route53:Get*",
          "route53:List*",
          "route53:TestDNSAnswer"
        ],
        "Resource" = "*"
      },
      {
        "Sid" : "S3Permissions"
        "Effect" = "Allow",
        "Action" = [
          "s3:*",
          "s3-object-lambda:*"
        ],
        "Resource" = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "route53_maintenance_mode_switch_policy" {
  name        = "Route53MaintenanceModeSwitchPolicy"
  description = "Policy for Route53 Maintenance Mode Switch"
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Sid"      = "Route53Permissions",
        "Effect"   = "Allow",
        "Action"   = "route53:ChangeResourceRecordSets",
        "Resource" = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "deploy_infrastructure_policy" {
  role       = aws_iam_role.github_actions_user_role.name
  policy_arn = aws_iam_policy.deploy_infrastructure_policy.arn
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy_lambda_policy_attachment" {
  role       = aws_iam_role.github_actions_user_role.name
  policy_arn = aws_iam_policy.deploy_lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy_website_policy" {
  role       = aws_iam_role.github_actions_user_role.name
  policy_arn = aws_iam_policy.deploy_website_policy.arn
}


resource "aws_iam_role_policy_attachment" "route53_maintenance_mode_switch_policy_attachment" {
  role       = aws_iam_role.github_actions_user_role.name
  policy_arn = aws_iam_policy.route53_maintenance_mode_switch_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_read_only_access_policy" {
  role       = aws_iam_role.github_actions_user_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}
