resource "aws_api_gateway_rest_api" "default" {
  name        = "${terraform.workspace}"
}

resource "aws_api_gateway_resource" "health" {
  rest_api_id = aws_api_gateway_rest_api.default.id
  parent_id   = aws_api_gateway_rest_api.default.root_resource_id
  path_part   = "health"
}

resource "aws_api_gateway_method" "health_get" {
  rest_api_id   = aws_api_gateway_rest_api.default.id
  resource_id   = aws_api_gateway_resource.health.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "health_get" {
  rest_api_id = aws_api_gateway_rest_api.default.id
  resource_id = aws_api_gateway_resource.health.id
  http_method = aws_api_gateway_method.health_get.http_method

  type = "MOCK"
}

resource "aws_api_gateway_deployment" "default" {
  depends_on  = [aws_api_gateway_integration.health_get]
  rest_api_id = aws_api_gateway_rest_api.default.id
  stage_name  = "default"
}

resource "aws_api_gateway_domain_name" "default" {
  certificate_arn = aws_acm_certificate_validation.api.certificate_arn
  domain_name     = var.api_domain_name
}

resource "aws_api_gateway_base_path_mapping" "default" {
  depends_on = [
    aws_api_gateway_domain_name.default,
    aws_api_gateway_rest_api.default,
    aws_api_gateway_deployment.default
  ]

  api_id      = aws_api_gateway_rest_api.default.id
  stage_name  = "default"
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
