data "aws_vpc" "default" {
  default = true
}

resource "aws_vpc" "main" {
  count      = var.create_new ? 1 : 0
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "main"
  }
}
