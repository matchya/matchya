resource "aws_s3_bucket" "website_bucket_staging" {
  bucket = "staging.matchya.ca"
}

resource "aws_s3_bucket_website_configuration" "website_bucket_staging" {
  bucket = aws_s3_bucket.website_bucket_staging.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website_bucket_staging" {
  bucket = aws_s3_bucket.website_bucket_staging.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "website_bucket_staging" {
  depends_on = [aws_s3_bucket_public_access_block.website_bucket_staging]
  bucket = aws_s3_bucket.website_bucket_staging.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = ["s3:GetObject"],
        Effect    = "Allow",
        Resource  = ["arn:aws:s3:::staging.matchya.ca/*"],
        Principal = "*"
      },
    ],
  })
}
