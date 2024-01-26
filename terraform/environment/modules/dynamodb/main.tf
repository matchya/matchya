resource "aws_dynamodb_table" "company" {
  name           = "${terraform.workspace}-Company"
  billing_mode   = "PROVISIONED"
  hash_key       = "company_id"

  read_capacity = 1
  write_capacity = 1

  attribute {
    name = "company_id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name               = "EmailIndex"
    hash_key           = "email"
    read_capacity      = 10
    write_capacity     = 10
    projection_type    = "ALL"
  }
}

resource "aws_dynamodb_table" "access_token" {
  name           = "${terraform.workspace}-AccessToken"
  billing_mode   = "PROVISIONED"
  hash_key       = "token_id"

  read_capacity = 1
  write_capacity = 1

  attribute {
    name = "token_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "interview_access_token" {
  name           = "${terraform.workspace}-InterviewAccessToken"
  billing_mode   = "PROVISIONED"
  hash_key       = "token"

  read_capacity  = 10
  write_capacity = 10

  attribute {
    name = "token"
    type = "S"
  }
}
