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

# resource "aws_route53_record" "vercel_a" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = var.domain_name["prod"]
#   type    = "A"
#   ttl     = "300"
#   records = [var.vercel_records["a"]]
# }


# resource "aws_route53_record" "vercel_cname" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "www"
#   type    = "CNAME"
#   ttl     = "300"
#   records = [var.vercel_records["cname"]]
# }
