resource "aws_ssm_parameter" "bastion_ip" {
  name  = "/terraform/shared/bastion_host/elastic_ip"
  type  = "String"
  value = aws_eip.bastion[0].public_ip
}
