variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "app_cloudfront_distributon_url" {
  description = "The cloudfront distribution url for the app"
  type = string
}

variable "www_app_cloudfront_distribution_url" {
  description = "The cloudfront distribution url for the www app"
  type = string
}

variable "app_cloudfront_distribution_zone" {
  description = "The cloudfront distribution zone for the app"
  type = string
}
