resource "aws_ssm_parameter" "route53_zone_id" {
  name  = "/terraform/shared/route53/zone_id"
  type  = "String"
  value = aws_route53_zone.main.zone_id
}

resource "aws_ssm_parameter" "route53_hosted_zone" {
  name  = "/terraform/shared/route53/hosted_zone"
  type  = "String"
  value = aws_route53_zone.main.name
}
