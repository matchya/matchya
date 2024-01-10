output "rds_postgres_insecure_security_group" {
  value = var.create_new ? aws_security_group.rds_postgres_insecure[0] : data.aws_security_group.rds_postgres_insecure[0]
}

output "rds_postgres_secure_security_group" {
  value = var.create_new ? aws_security_group.rds_postgres_secure[0] : data.aws_security_group.rds_postgres_secure[0]
}

output "public_ec2_security_group" {
  value = var.create_new ? aws_security_group.ec2_public[0] : data.aws_security_group.ec2_public[0]
}

output "public_subnet_1" {
  value = var.create_new ? aws_subnet.public_1[0] : data.aws_subnet.public_1[0]
}

output "private_subnet_1" {
  value = var.create_new ? aws_subnet.private_1[0] : data.aws_subnet.private_1[0]
}

output "private_subnet_2" {
  value = var.create_new ? aws_subnet.private_2[0] : data.aws_subnet.private_2[0]
}
