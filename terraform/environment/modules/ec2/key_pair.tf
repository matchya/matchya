resource "aws_key_pair" "bastion" {
  count      = var.is_release_environment ? 1 : 0
  key_name   = "${terraform.workspace}-bastion_key_pair"
  public_key = file("~/.ssh/id_rsa_matchya.pub")

  tags = {
    Name        = "bastion-host"
    Environment = "${terraform.workspace}"
  }
}
