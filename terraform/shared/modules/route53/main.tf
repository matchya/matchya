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

resource "aws_route53_record" "webflow_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name = "${var.hosted_zone}"
  type = "A"
  ttl = 300
  records = var.webflow_records["a"]
}

resource "aws_route53_record" "webflow_txt" {
  zone_id = data.aws_route53_zone.main.zone_id
  name = "_webflow"
  type = "TXT"
  ttl = 300
  records = var.webflow_records["txt"]
}

resource "aws_route53_record" "www_webflow_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name = "www.${var.hosted_zone}"
  type = "CNAME"
  ttl = 300
  records = var.www_webflow_records["cname"]
}

data "aws_route53_zone" "main" {
  name = var.hosted_zone
}
