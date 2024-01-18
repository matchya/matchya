output "rds_postgres_insecure_security_group" {
  value = aws_security_group.rds_postgres_insecure
}

output "rds_postgres_secure_security_group" {
  value = aws_security_group.rds_postgres_secure
}

output "public_ec2_security_group" {
  value = aws_security_group.ec2_public
}

output "public_subnet_1" {
  value = aws_subnet.public_1
}

output "public_subnet_2" {
  value = aws_subnet.public_2
}

output "private_subnet_1" {
  value = aws_subnet.private_1
}

output "private_subnet_2" {
  value = aws_subnet.private_2
}
