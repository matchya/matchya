locals {
  app_domain_name = terraform.workspace == "production" ? "app.${data.aws_ssm_parameter.route53_hosted_zone.value}" : "app.${terraform.workspace}.${data.aws_ssm_parameter.route53_hosted_zone.value}"
}

module "app" {
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


