variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "app_domain_name" {
  description = "The domain name for the application"
  type = string
}

variable "google_workspace_record_name" {
  description = "The name of the google workspace record"
  type = string
}

variable "google_workspace_records" {
  description = "Map of google workspace records"
  type = map(list(string))
}
