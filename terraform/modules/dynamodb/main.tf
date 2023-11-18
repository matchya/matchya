resource "aws_dynamodb_table" "company_info" {
  name           = "${terraform.workspace}-CompanyInfo"
  billing_mode   = "PROVISIONED"
  hash_key       = "CompanyId"

  read_capacity = 1
  write_capacity = 1

  attribute {
    name = "CompanyId"
    type = "S"
  }
}
