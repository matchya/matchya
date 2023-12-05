resource "aws_s3_bucket" "root" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_public_access_block" "root" {
  bucket = aws_s3_bucket.root.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "root" {
  depends_on = [aws_s3_bucket_public_access_block.root]
  bucket = aws_s3_bucket.root.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = ["s3:GetObject"],
        Effect    = "Allow",
        Resource  = ["arn:aws:s3:::${var.domain_name}/*"],
        Principal = "*"
      },
    ],
  })
}

resource "aws_s3_bucket_website_configuration" "root" {
  bucket = aws_s3_bucket.root.id

  redirect_all_requests_to {
    protocol = "http"
    host_name = "www.${var.domain_name}"
  }
}
