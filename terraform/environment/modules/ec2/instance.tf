resource "aws_instance" "bastion" {
  count = terraform.workspace != "dev" ? 1 : 0
  ami                         = "ami-007855ac798b5175e"
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.bastion[0].key_name
  vpc_security_group_ids      = [var.public_ec2_security_group.id]
  subnet_id                   = var.public_subnet_1[0].id
  associate_public_ip_address = true

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/id_rsa_matchya")
    host        = self.public_ip
  }

  tags = {
    Name = "${terraform.workspace}-bastion-host"
  }
}
