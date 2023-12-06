module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "route53" {
  source = "./modules/route53"

  domain_name = var.domain_name
  www_root = module.s3.www_root
  root = module.s3.root
}

module "s3" {
  source = "./modules/s3"

  domain_name = var.domain_name
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}
