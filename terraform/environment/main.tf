locals {
  namespace = "matchya"
  app_domain_name = lookup({
    production = "app.${data.aws_ssm_parameter.route53_hosted_zone.value}",
    staging = "app.${terraform.workspace}.${data.aws_ssm_parameter.route53_hosted_zone.value}"
  }, terraform.workspace, "http://127.0.0.1:5173")
}

module "app" {
  count = terraform.workspace == "staging" ? 1 : 0
  source = "./modules/app"

  region = data.aws_region.current.name
  app_domain_name = local.app_domain_name
  hosted_zone_id = data.aws_ssm_parameter.route53_zone_id.value
}

module "apigateway" {
  source = "./modules/apigateway"

  client_origin = local.app_domain_name
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "ec2" {
  source = "./modules/ec2"

  public_ec2_security_group = module.vpc.public_ec2_security_group
  public_subnet_1 = module.vpc.public_subnet_1
}

module "iam" {
  source = "../shared/modules/iam"

  create_new = false
}

module "rds" {
  source = "./modules/rds"

  db_username = var.db_username
  db_password = var.db_password
  rds_postgres_insecure_security_group = module.vpc.rds_postgres_insecure_security_group
  rds_postgres_secure_security_group = module.vpc.rds_postgres_secure_security_group

  public_subnet_1 = module.vpc.public_subnet_1
  public_subnet_2 = module.vpc.public_subnet_2
  private_subnet_1 = module.vpc.private_subnet_1
  private_subnet_2 = module.vpc.private_subnet_2

  region = data.aws_region.current.name
  account_id = data.aws_caller_identity.current.account_id
}

module "route53" {
  count = terraform.workspace != "dev" ? 1 : 0
  source = "./modules/route53"

  hosted_zone = var.hosted_zone
  app_cloudfront_distributon_url = module.app[0].cloudfront_distribution_url
  www_app_cloudfront_distribution_url = module.app[0].www_cloudfront_distribution_url
  app_cloudfront_distribution_zone = module.app[0].cloudfront_distribution_zone
}

module "sqs" {
  source = "./modules/sqs"
}

module "s3" {
  source = "./modules/s3"

  account_id = data.aws_caller_identity.current.account_id
  client_origin = local.app_domain_name
  namespace = local.namespace
}

module "vpc" {
  source = "./modules/vpc"

  nat_eip_id = module.ec2.nat_eip_id
  region = data.aws_region.current.name
}
