resource "aws_ssm_parameter" "cloudfront_distribution_id" {
  name  = "/terraform/${terraform.workspace}/www.${var.app_domain_name}/cloudfront_distribution_id"
  type  = "String"
  value = aws_cloudfront_distribution.www.id
}
