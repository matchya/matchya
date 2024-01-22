data "aws_route53_zone" "main" {
  name = var.hosted_zone
}

resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.main.zone_id
  name = terraform.workspace == "staging" ? "app.${terraform.workspace}.${var.hosted_zone}" : "app.${var.hosted_zone}"
  type = "A"
  alias {
    name = var.app_cloudfront_distributon_url
    zone_id = var.app_cloudfront_distribution_zone
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_app" {
  zone_id = data.aws_route53_zone.main.zone_id
  name = terraform.workspace == "staging" ? "www.app.${terraform.workspace}.${var.hosted_zone}" : "app.${var.hosted_zone}"
  type = "A"
  alias {
    name = var.www_app_cloudfront_distribution_url
    zone_id = var.app_cloudfront_distribution_zone
    evaluate_target_health = false
  }
}
