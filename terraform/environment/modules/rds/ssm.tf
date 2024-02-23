resource "aws_ssm_parameter" "db_instance_endpoint" {
  count = terraform.workspace == "staging" ? 0 : 1
  name  = "/terraform/${terraform.workspace}/rds/endpoint"
  type  = "String"
  value = var.is_release_environment ? element(split(":", aws_db_instance.secure[0].endpoint), 0) : element(split(":", aws_db_instance.insecure[0].endpoint), 0)
}

resource "aws_ssm_parameter" "db_instance_name" {
  count = terraform.workspace == "staging" ? 0 : 1
  name  = "/terraform/${terraform.workspace}/rds/db_name"
  type  = "String"
  value = var.is_release_environment ? aws_db_instance.secure[0].db_name : aws_db_instance.insecure[0].db_name
}

resource "aws_ssm_parameter" "db_instance_port" {
  count = terraform.workspace == "staging" ? 0 : 1
  name  = "/terraform/${terraform.workspace}/rds/port"
  type  = "String"
  value = var.is_release_environment ? tostring(aws_db_instance.secure[0].port) : tostring(aws_db_instance.insecure[0].port)
}

resource "aws_ssm_parameter" "db_instance_password" {
  name  = "/terraform/${terraform.workspace}/rds/db_password"
  type  = "SecureString"
  value = var.db_password
}

resource "aws_ssm_parameter" "db_instance_username" {
  name  = "/terraform/${terraform.workspace}/rds/db_username"
  type  = "String"
  value = var.db_username
}
