module "apigateway" {
  source = "./modules/apigateway"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "iam" {
  source = "./modules/iam"
}

module "rds" {
  source = "./modules/rds"

  db_username = var.db_username
  db_password = var.db_password
  rds_security_group_id = module.vpc.rds_security_group_id
}

module "ssm" {
  source = "./modules/ssm"

  open_api_key = var.openai_api_key
  github_token = var.github_token
}

module "vpc" {
  source = "./modules/vpc"
}
