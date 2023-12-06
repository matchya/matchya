resource "aws_s3_bucket" "www_root" {
  bucket = "www.${var.domain_name}"
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
}
