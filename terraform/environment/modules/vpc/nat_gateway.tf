resource "aws_nat_gateway" "nat" {
  count         = var.is_release_environment ? 1 : 0
  allocation_id = var.nat_eip_id
  subnet_id     = aws_subnet.public_1[0].id

  tags = {
    Environment = "${terraform.workspace}"
  }
}
