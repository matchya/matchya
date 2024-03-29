resource "aws_ssm_parameter" "bastion_ip" {
  count = var.is_release_environment ? 1 : 0
  name  = "/terraform/${terraform.workspace}/ec2/elastic_ip/bastion_host"
  type  = "String"
  value = aws_eip.bastion[0].public_ip
}
