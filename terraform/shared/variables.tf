variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "google_workspace_records" {
  description = "Map of google workspace records"
  type = map(list(string))
}
