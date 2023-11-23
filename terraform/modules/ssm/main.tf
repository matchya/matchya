resource "aws_ssm_parameter" "openai_api_key" {
  name  = "/terraform/ssm/openai_api_key"
  type  = "String"
  value = var.open_api_key
}

resource "aws_ssm_parameter" "github_token" {
  name  = "/terraform/ssm/github_token"
  type  = "String"
  value = var.github_token
}
