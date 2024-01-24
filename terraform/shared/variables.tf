variable "hosted_zone" {
  description = "The hosted zone for the domain"
  type = string
}

variable "google_workspace_records" {
  description = "Map of google workspace records"
  type = map(list(string))
}

variable "webflow_records" {
  description = "Map of webflow records"
  type = map(list(string))
}

variable "www_webflow_records" {
  description = "Map of www webflow records"
  type = map(list(string))
}

variable "sendgrid_cname_1_name" {
  description = "The name of the first sendgrid cname record"
  type = string
}

variable "sendgrid_cname_1_record" {
  description = "The record of the first sendgrid cname record"
  type = string
}

variable "sendgrid_cname_2_name" {
  description = "The name of the second sendgrid cname record"
  type = string
}

variable "sendgrid_cname_2_record" {
  description = "The record of the second sendgrid cname record"
  type = string
}

variable "sendgrid_cname_3_name" {
  description = "The name of the third sendgrid cname record"
  type = string
}

variable "sendgrid_cname_3_record" {
  description = "The record of the third sendgrid cname record"
  type = string
}

variable "sendgrid_cname_4_name" {
  description = "The name of the fourth sendgrid cname record"
  type = string
}

variable "sendgrid_cname_4_record" {
  description = "The record of the fourth sendgrid cname record"
  type = string
}

variable "sendgrid_cname_5_name" {
  description = "The name of the fifth sendgrid cname record"
  type = string
}

variable "sendgrid_cname_5_record" {
  description = "The record of the fifth sendgrid cname record"
  type = string
}

variable "sendgrid_txt_name" {
  description = "The sendgrid txt name"
  type = string
}

variable "sendgrid_txt_record" {
  description = "The sendgrid txt record"
  type = string
}
