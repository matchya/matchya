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

  tags = {
    Environment = "${terraform.workspace}"
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

  attribute {
    name = "candidate_id"
    type = "S"
  }

  attribute {
    name = "interview_id"
    type = "S"
  }

  global_secondary_index {
    name               = "CandidateInterviewIndex"
    hash_key           = "candidate_id"
    range_key          = "interview_id"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
  }

  tags = {
    Environment = "${terraform.workspace}"
  }
}
