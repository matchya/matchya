resource "aws_route53_record" "api" {
  name    = aws_api_gateway_domain_name.default.domain_name
  type    = "A"
  zone_id = var.hosted_zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.default.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.default.cloudfront_zone_id
  }
}
