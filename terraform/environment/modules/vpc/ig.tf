resource "aws_internet_gateway" "main" {
  count = terraform.workspace != "dev" ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  tags = {
    Name = terraform.workspace
  }
}
