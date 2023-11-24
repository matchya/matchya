resource "aws_ssm_parameter" "lambda_role_arn" {
  count = var.create_new ? 1 : 0
  name  = "/terraform/shared/iam/lambda_role_arn"
  type  = "String"
  value = aws_iam_role.lambda_role[0].arn
}
