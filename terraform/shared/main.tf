module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "website_production" {
  source = "./modules/website"

  domain_name = var.domain_name["prod"]
  region = data.aws_region.current.name
  hosted_zone_id = aws_route53_zone.main.zone_id
}

module "website_staging" {
  source = "./modules/website"

  domain_name = var.domain_name["staging"]
  region = data.aws_region.current.name
  hosted_zone_id = aws_route53_zone.main.zone_id
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}

resource "aws_route53_zone" "main" {
  name         = var.domain_name["prod"]
}
