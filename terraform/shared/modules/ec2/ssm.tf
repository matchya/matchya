resource "aws_ssm_parameter" "bastion_ip" {
  name  = "/terraform/shared/ec2/elastic_ip/bastion_host"
  type  = "String"
  value = aws_eip.bastion[0].public_ip
}
