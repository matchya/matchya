locals {
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

  private_subnet_1 = module.vpc.private_subnet_1
  private_subnet_2 = module.vpc.private_subnet_2

  region = data.aws_region.current.name
  account_id = data.aws_caller_identity.current.account_id
}

module "sqs" {
  source = "./modules/sqs"
}

module "s3" {
  source = "./modules/s3"

  client_origin = local.app_domain_name
}

module "vpc" {
  source = "../shared/modules/vpc"

  create_new = false
}


