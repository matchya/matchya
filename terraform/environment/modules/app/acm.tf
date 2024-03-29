resource "aws_acm_certificate" "app" {
  depends_on = [
    aws_s3_bucket.main,
    aws_s3_bucket.www
  ]
  domain_name               = var.app_domain_name
  validation_method         = "DNS"
  subject_alternative_names = ["www.${var.app_domain_name}"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  depends_on      = [aws_acm_certificate.app]
  allow_overwrite = true
  for_each = {
    for dvo in aws_acm_certificate.app.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "cert" {
  depends_on = [
    aws_acm_certificate.app,
    aws_route53_record.cert_validation
  ]
  certificate_arn         = aws_acm_certificate.app.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]

  lifecycle {
    create_before_destroy = true
  }
}
