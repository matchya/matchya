variable "domain_name" {
  description = "Map of domain names for different environments"
  type = map(string)
}

variable "vercel_records" {
  description = "Map of vercel records for production"
  type = map(string)
}
