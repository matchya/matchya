module "apigateway" {
  source = "./modules/apigateway"

  client_origin = var.client_origin
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
  rds_security_group = module.vpc.rds_security_group
  rds_security_group_new = module.vpc.rds_security_group_new

  private_subnet_1 = module.vpc.private_subnet_1
  private_subnet_2 = module.vpc.private_subnet_2
}

module "sqs" {
  source = "./modules/sqs"
}

module "vpc" {
  source = "../shared/modules/vpc"

  create_new = false
}
