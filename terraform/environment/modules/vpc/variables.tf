variable "nat_eip_id" {
  description = "The ID of the NAT Elastic IP Address"
  type = string
}

variable "region" {
  description = "The AWS region"
  type = string
}

variable "is_release_environment" {
  description = "Whether or not this is a release environment"
  type = bool
}
