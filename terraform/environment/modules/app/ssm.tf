resource "aws_ssm_parameter" "cloudfront_distribution_id" {
  name  = "/terraform/${terraform.workspace}/${var.app_domain_name}/cloudfront_distribution_id"
  type  = "String"
  value = aws_cloudfront_distribution.main.id
}

resource "aws_ssm_parameter" "cloud_distribution_url" {
  name = "/terraform/${terraform.workspace}/cloudfront/url/${var.app_domain_name}"
  type = "String"
  value = "${aws_cloudfront_distribution.main.domain_name}"
}

resource "aws_ssm_parameter" "www_cloud_distribution_url" {
  name = "/terraform/${terraform.workspace}/cloudfront/url/www.${var.app_domain_name}"
  type = "String"
  value = "${aws_cloudfront_distribution.www.domain_name}"
}
