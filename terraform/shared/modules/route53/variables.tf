variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

# variable "vercel_records" {
#   description = "Map of vercel records for production"
#   type = map(string)
# }

variable "google_workspace_record_name" {
  description = "The name of the google workspace record"
  type = string
}

variable "google_workspace_records" {
  description = "Map of google workspace records"
  type = map(list(string))
}
