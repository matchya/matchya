terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.49"
    }
  }
  backend "s3" {
    bucket = "matchya-terraform"
    key    = "shared/terraform.tfstate"
    region = "us-east-1"
    encrypt = false
  }
}
