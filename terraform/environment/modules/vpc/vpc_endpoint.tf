resource "aws_vpc_endpoint" "rds" {
  count = terraform.workspace != "dev" ? 1 : 0
  depends_on = [ aws_security_group.vpc_endpoint ]
  vpc_id              = aws_vpc.main[0].id
  service_name        = "com.amazonaws.us-east-1.rds"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoint[0].id]
  subnet_ids         = [aws_subnet.private_1[0].id, aws_subnet.private_2[0].id]

  tags = {
    Name = "${terraform.workspace}-rds"
  }
}
