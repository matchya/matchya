# This file is used to set up S3 bucket to store terraform plan files uploaded by GitHub Actions
resource "aws_s3_bucket" "github_actions_artifacts" {
  bucket = "github-actions-remote-artifacts"

  lifecycle {
    create_before_destroy = true
  }
}
