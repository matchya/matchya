resource "aws_security_group" "lambda" {
  count      = var.create_new ? 1 : 0
  name = "lambda"
  description = "Security group for Serverless functions"
  vpc_id      = aws_vpc.main[0].id

  ingress {
    from_port        = 0
    to_port          = 65535
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 6379
    to_port          = 6379
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }


  tags = {
    Name = "lambda"
  }
}

resource "aws_security_group" "rds_postgres_insecure" {
  count      = var.create_new ? 1 : 0
  name = "rds-postgres-insecure"
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
    Name = "rds-postgres-insecure"
  }
}

# testing new one inside vpc
resource "aws_security_group" "rds_postgres_secure" {
  count      = var.create_new ? 1 : 0
  name = "rds-postgres-secure"
  description = "Security group for RDS Postgres database"
  vpc_id      = aws_vpc.main[0].id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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
    Name = "rds-postgres-secure"
  }
}

resource "aws_security_group" "ec2_public" {
  count      = var.create_new ? 1 : 0
  name = "ec2-public"
  description = "Security group for EC2 Public Bastion Host. Used to access private resources within VPC."
  vpc_id      = aws_vpc.main[0].id

  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 6379
    to_port          = 6379
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    "Name" = "ec2-public"
  }
}

resource "aws_security_group" "vpc_endpoint" {
  count      = var.create_new ? 1 : 0
  name = "vpc-endpoint"
  description = "Security group for VPC Endpoint"
  vpc_id      = aws_vpc.main[0].id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = -1
    security_groups = [aws_security_group.lambda[0].id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    "Name" = "vpc-endpoint"
  }
}

# Data sources
data "aws_security_group" "rds_postgres_insecure" {
  count      = var.create_new ? 0 : 1
  name = "rds-postgres-insecure"
}

data "aws_security_group" "rds_postgres_secure" {
  count      = var.create_new ? 0 : 1
  name = "rds-postgres-secure"
}

data "aws_security_group" "ec2_public" {
  count      = var.create_new ? 0 : 1
  name = "ec2-public"
}
