
resource "aws_eip" "bastion" {
  count = terraform.workspace != "dev" ? 1 : 0
  instance = aws_instance.bastion[0].id

  tags = {
    Name = "${terraform.workspace}-bastion-host"
  }
}

resource "aws_eip" "nat" {
  count = terraform.workspace != "dev" ? 1 : 0

  tags = {
    Name = "${terraform.workspace}-nat-gateway"
  }
}
