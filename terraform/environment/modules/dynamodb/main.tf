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
