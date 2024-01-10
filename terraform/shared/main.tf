module "ec2" {
  source = "./modules/ec2"

  public_ec2_security_group = module.vpc.public_ec2_security_group
  public_subnet_1 = module.vpc.public_subnet_1
}

module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "route53" {
  source = "./modules/route53"

  domain_name = var.domain_name
  vercel_records = var.vercel_records
}

module "website_staging" {
  source = "./modules/website"

  domain_name = var.domain_name["staging"]
  region = data.aws_region.current.name
  hosted_zone = module.route53.main_route53_zone
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}
