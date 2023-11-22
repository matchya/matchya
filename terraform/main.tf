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

module "vpc" {
  source = "./modules/vpc"
}
