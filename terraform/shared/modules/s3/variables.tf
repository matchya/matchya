variable "account_id" {
  description = "The account id"
  type        = string
}

variable "client_origins" {
  description = "The origin of the client application"
  type        = list(string)
}

variable "namespace" {
  description = "The namespace for the environment"
  type        = string
}
