resource "aws_route53_zone" "main" {
  name         = var.hosted_zone
}

resource "aws_route53_record" "google_workspace_mx" {
  zone_id = aws_route53_zone.main.zone_id
  name = var.google_workspace_record_name
  type = "MX"
  ttl = "86400"
  records = var.google_workspace_records["mx"]
}
