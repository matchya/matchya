locals {
  namespace = "matchya"
  app_domain_name = lookup({
    production = "app.${data.aws_ssm_parameter.route53_hosted_zone.value}",
    staging = "app.${terraform.workspace}.${data.aws_ssm_parameter.route53_hosted_zone.value}"
  }, terraform.workspace, "http://127.0.0.1:5173")
  api_domain_name = lookup({
    production = "api.${data.aws_ssm_parameter.route53_hosted_zone.value}",
    staging = "api.${terraform.workspace}.${data.aws_ssm_parameter.route53_hosted_zone.value}"
  }, terraform.workspace, "")
}

# # Handles api gateway with custom domain setup
module "api" {
  count = terraform.workspace != "dev" ? 1 : 0
  source = "./modules/api"

  api_domain_name = local.api_domain_name
  client_origin = local.app_domain_name
  hosted_zone_id = data.aws_ssm_parameter.route53_zone_id.value
  region = data.aws_region.current.name
}

# # Handles client facing application with custom domain setup
module "app" {
  count = terraform.workspace != "dev" ? 1 : 0
  source = "./modules/app"

  app_domain_name = local.app_domain_name
  hosted_zone = var.hosted_zone
  hosted_zone_id = data.aws_ssm_parameter.route53_zone_id.value
  region = data.aws_region.current.name
  route53_zone_id = module.route53[0].route53_zone_id
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "ec2" {
  source = "./modules/ec2"

  public_ec2_security_group = module.vpc.public_ec2_security_group
  public_subnet_1 = module.vpc.public_subnet_1
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
}

module "sqs" {
  source = "./modules/sqs"
}

module "vpc" {
  source = "./modules/vpc"

  nat_eip_id = module.ec2.nat_eip_id
  region = data.aws_region.current.name
}
