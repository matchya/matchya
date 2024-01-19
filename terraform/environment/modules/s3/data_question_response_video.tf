resource "aws_s3_bucket" "data_question_response_video" {
  bucket = "${terraform.workspace}-data-question-response-video"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_s3_bucket_cors_configuration" "data_question_response_video" {
  bucket = aws_s3_bucket.data_question_response_video.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [var.client_origin]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "data_question_response_video" {
  bucket = aws_s3_bucket.data_question_response_video.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "data_question_response_video" {
  bucket = aws_s3_bucket.data_question_response_video.id

  depends_on = [aws_s3_bucket_public_access_block.data_question_response_video]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:*"
        Resource  = "${aws_s3_bucket.data_question_response_video.arn}/*"
      }
    ]
  })
}
