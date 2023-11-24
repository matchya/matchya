output "rds_security_group_id" {
  value = var.create_new ? aws_security_group.rds[0].id : data.aws_security_group.rds[0].id
}
