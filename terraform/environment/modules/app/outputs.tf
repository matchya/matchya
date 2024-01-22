output "cloudfront_distribution_url" {
  value = "${aws_cloudfront_distribution.main.domain_name}"
}

output "www_cloudfront_distribution_url" {
  value = "${aws_cloudfront_distribution.www.domain_name}"
}

output "cloudfront_distribution_zone" {
  value = "${aws_cloudfront_distribution.main.hosted_zone_id}"
}
