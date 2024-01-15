resource "aws_ssm_parameter" "domain_name" {
  name  = "/terraform/${terraform.workspace}/domain_name"
  type  = "String"
  value = local.app_domain_name
}
