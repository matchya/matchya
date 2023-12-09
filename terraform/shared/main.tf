module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "website" {
  source = "./modules/website"

  domain_name = var.domain_name
  ns_records = var.ns_records
  region = data.aws_region.current.name
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}
