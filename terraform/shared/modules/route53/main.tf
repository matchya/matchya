resource "aws_route53_zone" "main" {
  name         = var.domain_name
}

resource "aws_route53_record" "ns" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.domain_name}"
  type    = "NS"
  ttl     = "172800"
  records = [
    "ns-1224.awsdns-25.org",
    "ns-1564.awsdns-03.co.uk",
    "ns-433.awsdns-54.com",
    "ns-970.awsdns-57.net"
  ]
  allow_overwrite = true
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  alias {
    name                   = var.www_root.website_domain
    zone_id                = var.www_root.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "${var.domain_name}"
  type    = "A"
  alias {
    name                   = var.root.website_domain
    zone_id                = var.root.hosted_zone_id
    evaluate_target_health = false
  }
  allow_overwrite = true
}
