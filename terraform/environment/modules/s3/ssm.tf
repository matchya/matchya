resource "aws_ssm_parameter" "website_url_staging" {
  name  = "/terraform/staging/s3/website_endpoint"
  type  = "String"
  value = aws_s3_bucket_website_configuration.website_bucket_staging.website_endpoint
}
