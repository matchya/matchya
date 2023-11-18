module "apigateway" {
  source = "./modules/apigateway"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}
