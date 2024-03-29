locals {
  cidr_blocks = {
    dev        = null
    staging    = "10.1.0.0/16"
    production = "10.2.0.0/16"
  }
  cidr_block = lookup(local.cidr_blocks, terraform.workspace)
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_vpc" "main" {
  count                = var.is_release_environment ? 1 : 0
  cidr_block           = local.cidr_block
  enable_dns_hostnames = true
  tags = {
    Name        = "${terraform.workspace}"
    Environment = "${terraform.workspace}"
  }
}
