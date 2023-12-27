resource "aws_s3_bucket" "root" {
  bucket = var.domain_name

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
  }

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "root" {
  bucket = aws_s3_bucket.root.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "root" {
  bucket = aws_s3_bucket.root.id

  redirect_all_requests_to {
    protocol = "https"
    host_name = "www.${var.domain_name}"
  }
}

resource "aws_s3_bucket" "www_root" {
  bucket = "www.${var.domain_name}"

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "www_root" {
  bucket = aws_s3_bucket.www_root.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "www_root" {
  depends_on = [aws_s3_bucket_public_access_block.www_root]
  bucket = aws_s3_bucket.www_root.id

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

resource "aws_s3_bucket_website_configuration" "www_root" {
  bucket = aws_s3_bucket.www_root.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}
