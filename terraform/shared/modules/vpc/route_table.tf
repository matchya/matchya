# Public
resource "aws_route_table" "public" {
  count = var.create_new ? 1 : 0
  vpc_id = aws_vpc.main[0].id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main[0].id
  }

  tags = {
    Name = "route-table-public"
  }
}

resource "aws_route_table_association" "public_1" {
  count = var.create_new ? 1 : 0
  route_table_id = aws_route_table.public[0].id
  subnet_id      = aws_subnet.public_1[0].id
}

resource "aws_route_table_association" "public_2" {
  count = var.create_new ? 1 : 0
  route_table_id = aws_route_table.public[0].id
  subnet_id      = aws_subnet.public_2[0].id
}

# Private
resource "aws_route_table" "private" {
  count = var.create_new ? 1 : 0
  vpc_id = aws_vpc.main[0].id

  tags = {
    Name = "route-table-private"
  }
}

resource "aws_route_table_association" "private_1" {
  count = var.create_new ? 1 : 0
  route_table_id = aws_route_table.private[0].id
  subnet_id      = aws_subnet.private_1[0].id
}

resource "aws_route_table_association" "private_2" {
  count = var.create_new ? 1 : 0
  route_table_id = aws_route_table.private[0].id
  subnet_id      = aws_subnet.private_2[0].id
}
