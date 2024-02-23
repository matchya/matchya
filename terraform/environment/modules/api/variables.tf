variable "client_origin" {
  type = string
}

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
}

variable "api_domain_name" {
  description = "The domain name for the API"
  type        = string
}

variable "hosted_zone_id" {
  description = "The Route53 hosted zone ID"
  type        = string
}

variable "is_release_environment" {
  description = "Whether or not this is a release environment"
  type        = bool
}
