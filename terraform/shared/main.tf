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

  hosted_zone = var.hosted_zone
  # marketing_page_records = var.marketing_page_records
  # vercel_records = var.vercel_records
  google_workspace_record_name = var.google_workspace_record_name
  google_workspace_records = var.google_workspace_records
}

module "app" {
  source = "./modules/website"

  domain_name = var.app_domain_name
  region = data.aws_region.current.name
  hosted_zone = module.route53.main_route53_zone
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}
