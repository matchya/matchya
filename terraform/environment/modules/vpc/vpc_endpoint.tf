resource "aws_vpc_endpoint" "rds" {
  # will just use nat gateway for now to save money
  count = 0
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

resource "aws_vpc_endpoint" "s3" {
  vpc_id              = terraform.workspace != "dev" ? aws_vpc.main[0].id : data.aws_vpc.default.id
  service_name = "com.amazonaws.${var.region}.s3"

  tags = {
    Name: "${terraform.workspace}-s3"
  }
}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id              = terraform.workspace != "dev" ? aws_vpc.main[0].id : data.aws_vpc.default.id
  service_name = "com.amazonaws.${var.region}.dynamodb"

  tags = {
    Name: "${terraform.workspace}-dynamodb"
  }
}
