resource "aws_internet_gateway" "main" {
  count      = var.create_new ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  tags = {
    Name = "main"
  }
}
