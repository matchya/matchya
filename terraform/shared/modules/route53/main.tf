resource "aws_route53_zone" "main" {
  name         = var.hosted_zone
}

resource "aws_route53_record" "google_workspace_mx" {
  zone_id = aws_route53_zone.main.zone_id
  name = var.hosted_zone
  type = "MX"
  ttl = "86400"
  records = var.google_workspace_records["mx"]
}

data "aws_route53_zone" "main" {
  name = var.hosted_zone
}
