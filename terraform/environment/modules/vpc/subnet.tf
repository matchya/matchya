locals {
  cidr_blocks_list = {
    dev = {
      "public-1" = null,
      "public-2" = null,
      "private-1" = null,
      "private-2" = null
    },
    staging = {
      "public-1" = "10.1.1.0/24",
      "public-2" = "10.1.2.0/24",
      "private-1" = "10.1.3.0/24",
      "private-2" = "10.1.4.0/24"
    },
    production = {
      "public-1" = "10.2.1.0/24",
      "public-2" = "10.2.2.0/24",
      "private-1" = "10.2.3.0/24",
      "private-2" = "10.2.4.0/24"
    }
  }
  target_cidr_blocks = lookup(local.cidr_blocks_list, terraform.workspace)
}

resource "aws_subnet" "public_1" {
  count = terraform.workspace != "dev" ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = local.target_cidr_blocks["public-1"]
  map_public_ip_on_launch = true
  availability_zone = "us-east-1a"
  tags = {
    Name = "${terraform.workspace}-public-1"
  }
}

resource "aws_subnet" "public_2" {
  count = terraform.workspace != "dev" ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = local.target_cidr_blocks["public-2"]
  map_public_ip_on_launch = true
  availability_zone = "us-east-1b"
  tags = {
    Name = "${terraform.workspace}-public-2"
  }
}

resource "aws_subnet" "private_1" {
  count = terraform.workspace != "dev" ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = local.target_cidr_blocks["private-1"]
  availability_zone = "us-east-1a"
  tags = {
    Name = "${terraform.workspace}-private-1"
  }
}

resource "aws_subnet" "private_2" {
  count = terraform.workspace != "dev" ? 1 : 0
  vpc_id     = aws_vpc.main[0].id
  cidr_block = local.target_cidr_blocks["private-2"]
  availability_zone = "us-east-1b"
  tags = {
    Name = "${terraform.workspace}-private-2"
  }
}

data "aws_subnet" "public_1" {
  count = terraform.workspace == "dev" ? 1 : 0
  vpc_id = data.aws_vpc.default.id
  cidr_block = "172.31.0.0/20"
}

data "aws_subnet" "public_2" {
  count = terraform.workspace == "dev" ? 1 : 0
  vpc_id = data.aws_vpc.default.id
  cidr_block = "172.31.16.0/20"
}
