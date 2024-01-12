variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "app_domain_name" {
  description = "The domain name for the application"
  type = string
}

# variable "vercel_records" {
#   description = "Map of vercel records for production"
#   type = map(string)
# }
