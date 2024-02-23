resource "aws_eip" "bastion" {
  count    = var.is_release_environment ? 1 : 0
  instance = aws_instance.bastion[0].id

  tags = {
    Name        = "bastion-host"
    Environment = "${terraform.workspace}"
  }
}

resource "aws_eip" "nat" {
  count = var.is_release_environment ? 1 : 0

  tags = {
    Name        = "nat-gateway"
    Environment = "${terraform.workspace}"
  }
}
