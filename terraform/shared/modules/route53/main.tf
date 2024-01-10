resource "aws_route53_zone" "main" {
  name         = var.domain_name["prod"]
}

resource "aws_route53_record" "vercel_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name["prod"]
  type    = "A"
  ttl     = "300"
  records = [var.vercel_records["a"]]
}


resource "aws_route53_record" "vercel_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www"
  type    = "CNAME"
  ttl     = "300"
  records = [var.vercel_records["cname"]]
}
