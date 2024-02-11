resource "aws_route53_record" "api" {
  count = terraform.workspace != "dev" ? 1 : 0
  name    = aws_api_gateway_domain_name.default[0].domain_name
  type    = "A"
  zone_id = var.hosted_zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.default[0].cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.default[0].cloudfront_zone_id
  }
}
