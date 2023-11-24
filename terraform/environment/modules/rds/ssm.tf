resource "aws_ssm_parameter" "db_instance_endpoint" {
  name  = "/terraform/${terraform.workspace}/rds/endpoint"
  type  = "String"
  value = aws_db_instance.this.endpoint
}
