resource "aws_subnet" "public_1" {
  count      = var.create_new ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1a"
  tags = {
    Name = "public-1"
  }
}

resource "aws_subnet" "public_2" {
  count      = var.create_new ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1b"
  tags = {
    Name = "public-2"
  }
}

resource "aws_subnet" "private_1" {
  count      = var.create_new ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = "10.0.3.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "private-1"
  }
}

resource "aws_subnet" "private_2" {
  count      = var.create_new ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = "10.0.4.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "private-2"
  }
}

# data
data "aws_subnet" "public_1" {
  count = var.create_new ? 0 : 1

  filter {
    name   = "tag:Name"
    values = ["public-1"]
  }
}

data "aws_subnet" "public_2" {
  count = var.create_new ? 0 : 1

  filter {
    name   = "tag:Name"
    values = ["public-2"]
  }
}

data "aws_subnet" "private_1" {
  count = var.create_new ? 0 : 1

  filter {
    name   = "tag:Name"
    values = ["private-1"]
  }
}

data "aws_subnet" "private_2" {
  count = var.create_new ? 0 : 1

  filter {
    name   = "tag:Name"
    values = ["private-2"]
  }
}
