resource "aws_ssm_parameter" "api_gateway_id" {
  name  = "/terraform/${terraform.workspace}/api_gateway/id"
  type  = "String"
  value = aws_api_gateway_rest_api.default.id
}

resource "aws_ssm_parameter" "api_gateway_root_resource_id" {
  name  = "/terraform/${terraform.workspace}/api_gateway/root_resource_id"
  type  = "String"
  value = aws_api_gateway_rest_api.default.root_resource_id
}
