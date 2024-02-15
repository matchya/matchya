

resource "aws_s3_bucket" "page_maintenance" {
  bucket = var.maintenance_page_domain_name

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
  }

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "page_maintenance" {
  bucket = aws_s3_bucket.page_maintenance.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "page_maintenance" {
  bucket = aws_s3_bucket.page_maintenance.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "page_maintenance" {
  depends_on = [aws_s3_bucket_public_access_block.page_maintenance]
  bucket = aws_s3_bucket.page_maintenance.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = ["s3:GetObject"],
        Effect    = "Allow",
        Resource  = ["arn:aws:s3:::${"${var.maintenance_page_domain_name}"}/*"],
        Principal = "*"
      },
    ],
  })
}
