resource "aws_ssm_parameter" "cloudfront_distribution_url" {
  name  = "/terraform/shared/cloudfront/url/${var.maintenance_page_domain_name}"
  type  = "String"
  value = "${aws_cloudfront_distribution.page_maintenance.domain_name}"
}
