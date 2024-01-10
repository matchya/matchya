resource "aws_ssm_parameter" "cloudfront_distribution_id" {
  name  = "/terraform/shared/www.${var.domain_name}/cloudfront_distribution_id"
  type  = "String"
  value = aws_cloudfront_distribution.www.id
}
