resource "aws_internet_gateway" "main" {
  count  = var.is_release_environment ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  tags = {
    Environment = "${terraform.workspace}"
  }
}
