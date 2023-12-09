variable "domain_name" {
  type = any
}

variable "region" {
  type = string
}

variable "ns_records" {
  type = list(string)
}
