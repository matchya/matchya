resource "aws_nat_gateway" "nat" {
  count = terraform.workspace != "dev" ? 1 : 0
  allocation_id = var.nat_eip_id
  subnet_id     = aws_subnet.public_1[0].id

  tags = {
    Name = "${terraform.workspace}-nat-gateway"
  }
}
