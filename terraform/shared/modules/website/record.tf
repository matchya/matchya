resource "aws_route53_record" "ns" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.domain_name}"
  type    = "NS"
  ttl     = "3600"
  records = [
    "ns-1351.awsdns-40.org",
    "ns-356.awsdns-44.com",
    "ns-856.awsdns-43.net",
    "ns-2010.awsdns-59.co.uk"
  ]
  allow_overwrite = true
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.www_root.domain_name
    zone_id                = aws_cloudfront_distribution.www_root.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.root.domain_name
    zone_id                = aws_cloudfront_distribution.root.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}
