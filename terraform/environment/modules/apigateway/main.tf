resource "aws_api_gateway_rest_api" "default" {
  name        = "${terraform.workspace}-web-api"
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id    = aws_api_gateway_rest_api.default.id
  response_type  = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.client_origin}'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id    = aws_api_gateway_rest_api.default.id
  response_type  = "DEFAULT_5XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.client_origin}'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
  }
}

resource "aws_api_gateway_gateway_response" "unauthorized_response" {
  rest_api_id    = aws_api_gateway_rest_api.default.id
  response_type  = "UNAUTHORIZED"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.client_origin}'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
  }
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.default.id
}

output "api_gateway_root_resource_id" {
  value = aws_api_gateway_rest_api.default.root_resource_id
}
