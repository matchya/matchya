resource "aws_ssm_parameter" "vpc_id" {
  name  = "/terraform/${terraform.workspace}/vpc/id"
  type  = "String"
  value = terraform.workspace == "dev" ? data.aws_vpc.default.id : aws_vpc.main[0].id
}

resource "aws_ssm_parameter" "security_group_lambda" {
  name  = "/terraform/${terraform.workspace}/vpc/security_group_id/lambda"
  type  = "String"
  value = aws_security_group.lambda.id
}

resource "aws_ssm_parameter" "subnet_public_1" {
  name  = "/terraform/${terraform.workspace}/vpc/subnet_id/public_1"
  type  = "String"
  value = terraform.workspace != "dev" ? aws_subnet.public_1[0].id : data.aws_subnet.public_1[0].id
}

resource "aws_ssm_parameter" "subnet_public_2" {
  name  = "/terraform/${terraform.workspace}/vpc/subnet_id/public_2"
  type  = "String"
  value = terraform.workspace != "dev" ? aws_subnet.public_2[0].id : data.aws_subnet.public_2[0].id
}

resource "aws_ssm_parameter" "subnet_private_1" {
  count = terraform.workspace != "dev" ? 1 : 0
  name  = "/terraform/${terraform.workspace}/vpc/subnet_id/private_1"
  type  = "String"
  value = aws_subnet.private_1[0].id
}

resource "aws_ssm_parameter" "subnet_private_2" {
  count = terraform.workspace != "dev" ? 1 : 0
  name  = "/terraform/${terraform.workspace}/vpc/subnet_id/private_2"
  type  = "String"
  value = aws_subnet.private_2[0].id
}
