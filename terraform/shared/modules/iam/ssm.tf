resource "aws_ssm_parameter" "lambda_role_arn" {
  name  = "/terraform/shared/iam/lambda_role_arn"
  type  = "String"
  value = aws_iam_role.lambda_role.arn
}

resource "aws_ssm_parameter" "github_actions_user_access_key" {
  name  = "/terraform/shared/iam/user/github_actions/access_key"
  type  = "String"
  value = aws_iam_access_key.github_actions.id
}

resource "aws_ssm_parameter" "github_actions_user_secret_access_key" {
  name  = "/terraform/shared/iam/user/github_actions/secret_access_key"
  type  = "String"
  value = aws_iam_access_key.github_actions.secret
}
