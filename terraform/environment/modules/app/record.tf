resource "aws_route53_record" "app" {
  zone_id = var.route53_zone_id
  name = terraform.workspace == "staging" ? "app.${terraform.workspace}.${var.hosted_zone}" : "app.${var.hosted_zone}"
  type = "A"
  alias {
    name = aws_cloudfront_distribution.main.domain_name
    zone_id = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_app" {
  zone_id = var.route53_zone_id
  name = terraform.workspace == "staging" ? "www.app.${terraform.workspace}.${var.hosted_zone}" : "app.${var.hosted_zone}"
  type = "A"
  alias {
    name = aws_cloudfront_distribution.www.domain_name
    zone_id = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}
