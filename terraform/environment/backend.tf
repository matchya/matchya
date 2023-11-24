terraform {
  backend "s3" {
    bucket = "matchya-terraform"
    key    = "environment/terraform.tfstate"
    region = "us-east-1"
    encrypt = false
  }
}
