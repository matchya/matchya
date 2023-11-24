resource "aws_ssm_parameter" "db_instance_endpoint" {
  name  = "/terraform/${terraform.workspace}/rds/endpoint"
  type  = "String"
  value = element(split(":", aws_db_instance.this.endpoint), 0)
}

resource "aws_ssm_parameter" "db_instance_name" {
  name  = "/terraform/${terraform.workspace}/rds/db_name"
  type  = "String"
  value = aws_db_instance.this.db_name
}

resource "aws_ssm_parameter" "db_instance_port" {
  name  = "/terraform/${terraform.workspace}/rds/port"
  type  = "String"
  value = tostring(aws_db_instance.this.port)
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
