module "apigateway" {
  source = "./modules/apigateway"
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
  rds_security_group_id = module.vpc.rds_security_group_id
}

module "vpc" {
  source = "../shared/modules/vpc"

  create_new = false
}
