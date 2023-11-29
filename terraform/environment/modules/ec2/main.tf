resource "aws_instance" "bastion" {
  count = 0 # change this 1 when ready
  ami                         = "ami-007855ac798b5175e"
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.my_keypair.key_name
  vpc_security_group_ids      = [var.public_ec2_security_group.id]
  subnet_id                   = var.public_subnet_1.id
  associate_public_ip_address = true

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/id_rsa_matchya")
    host        = self.public_ip
  }

  tags = {
    Name = "bastion-host"
  }
}

resource "aws_eip" "bastion" {
  count = 0 # change this to 1 when ready
  instance = aws_instance.bastion[0].id
}

resource "aws_key_pair" "my_keypair" {
  key_name   = "my_keypair"
  public_key = file("~/.ssh/id_rsa_matchya.pub")
}
