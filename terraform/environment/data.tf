data "aws_region" "current" {}

data "aws_ssm_parameter" "route53_zone_id" {
  name = "/terraform/shared/route53/zone_id"
}

data "aws_ssm_parameter" "route53_hosted_zone" {
  name  = "/terraform/shared/route53/hosted_zone"
}
