resource "aws_ssm_parameter" "cloudfront_distribution_id" {
  name  = "/terraform/shared/production/www/cloudfront_distribution_id"
  type  = "String"
  value = aws_cloudfront_distribution.www_root.id
}
