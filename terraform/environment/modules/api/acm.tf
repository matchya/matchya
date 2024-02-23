resource "aws_acm_certificate" "api" {
  count                     = var.is_release_environment ? 1 : 0
  domain_name               = var.api_domain_name
  validation_method         = "DNS"
  subject_alternative_names = []

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation_api" {
  depends_on      = [aws_acm_certificate.api]
  allow_overwrite = true
  for_each = var.is_release_environment ? {
    for dvo in aws_acm_certificate.api[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  name    = each.value.name
  type    = each.value.type
  zone_id = var.hosted_zone_id
  records = [each.value.record]
  ttl     = 60

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "api" {
  count = var.is_release_environment ? 1 : 0
  depends_on = [
    aws_acm_certificate.api,
    aws_route53_record.cert_validation_api
  ]
  certificate_arn         = aws_acm_certificate.api[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation_api : record.fqdn]

  lifecycle {
    create_before_destroy = true
  }
}
