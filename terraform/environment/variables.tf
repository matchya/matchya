variable "namespace" {
    type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

variable "client_origin" {
  type = string
  default = "http://127.0.0.1:5173"
}
