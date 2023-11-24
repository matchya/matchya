module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "vpc" {
  source = "./modules/vpc"

  create_new = true
}
