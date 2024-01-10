module "ec2" {
  source = "./modules/ec2"

  public_ec2_security_group = module.vpc.public_ec2_security_group
  public_subnet_1 = module.vpc.public_subnet_1
}

module "iam" {
  source = "./modules/iam"

  create_new = true
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
