resource "aws_security_group" "rds" {
  count      = var.create_new ? 1 : 0
  name        = "rds-security-group"
  description = "Security group for RDS instance"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds-security-group"
  }
}

data "aws_security_group" "rds" {
  count      = var.create_new ? 0 : 1
  name = "rds-security-group"
}
