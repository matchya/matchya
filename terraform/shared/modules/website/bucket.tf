resource "aws_s3_bucket" "main" {
  bucket = var.domain_name

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
  }

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  redirect_all_requests_to {
    protocol = "https"
    host_name = "www.${var.domain_name}"
  }
}

resource "aws_s3_bucket" "www" {
  bucket = "www.${var.domain_name}"

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "www" {
  bucket = aws_s3_bucket.www.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "www" {
  depends_on = [aws_s3_bucket_public_access_block.www]
  bucket = aws_s3_bucket.www.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = ["s3:GetObject"],
        Effect    = "Allow",
        Resource  = ["arn:aws:s3:::${"www.${var.domain_name}"}/*"],
        Principal = "*"
      },
    ],
  })
}

resource "aws_s3_bucket_website_configuration" "www" {
  bucket = aws_s3_bucket.www.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}
