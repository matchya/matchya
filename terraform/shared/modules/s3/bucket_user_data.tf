resource "aws_s3_bucket" "user_data" {
  bucket = "${var.namespace}-user-data"
  force_destroy = true

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_s3_bucket_cors_configuration" "user_data" {
  bucket = aws_s3_bucket.user_data.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = var.client_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "user_data" {
  bucket = aws_s3_bucket.user_data.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "user_data" {
  bucket = aws_s3_bucket.user_data.id

  depends_on = [aws_s3_bucket_public_access_block.user_data]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:*"
        Resource  = "${aws_s3_bucket.user_data.arn}/*"
      }
    ]
  })
}
