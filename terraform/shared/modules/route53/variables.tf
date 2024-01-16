variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "google_workspace_records" {
  description = "Map of google workspace records"
  type = map(list(string))
}

variable "create_new" {
  description = "Whether to create a new hosted zone"
  type = bool
  default = false
}
