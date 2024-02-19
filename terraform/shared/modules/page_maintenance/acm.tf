resource "aws_acm_certificate" "wildcard" {
  domain_name       = "*.matchya.ai"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  depends_on      = [aws_acm_certificate.wildcard]
  allow_overwrite = true
  for_each = {
    for dvo in aws_acm_certificate.wildcard.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  type    = each.value.type
  zone_id = var.hosted_zone_id
  records = [each.value.record]
  ttl     = 60

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "wildcard" {
  depends_on = [
    aws_acm_certificate.wildcard
  ]

  certificate_arn         = aws_acm_certificate.wildcard.arn
  validation_record_fqdns = [for record in aws_acm_certificate.wildcard.domain_validation_options : record.resource_record_name]

  lifecycle {
    create_before_destroy = true
  }
}
