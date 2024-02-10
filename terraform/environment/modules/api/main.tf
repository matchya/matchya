resource "aws_api_gateway_rest_api" "default" {
  name        = "${terraform.workspace}-web-api"
}

resource "aws_api_gateway_domain_name" "default" {
  certificate_arn = aws_acm_certificate_validation.api.certificate_arn
  domain_name     = var.api_domain_name
}

resource "aws_api_gateway_base_path_mapping" "default" {
  depends_on = [
    aws_api_gateway_domain_name.default
  ]

  api_id      = aws_api_gateway_rest_api.default.id
  stage_name  = "${terraform.workspace}"
  domain_name = aws_api_gateway_domain_name.default.domain_name
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id    = aws_api_gateway_rest_api.default.id
  response_type  = "DEFAULT_4XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

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

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

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

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }
  status_code = "401"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.client_origin}'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
  }
}
