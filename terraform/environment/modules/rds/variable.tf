variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

variable "rds_postgres_insecure_security_group" {
  type = any
}

variable "rds_postgres_secure_security_group" {
  type = any
}

variable "public_subnet_1" {
  type = any
}

variable "public_subnet_2" {
  type = any
}

variable "private_subnet_1" {
  type = any
}

variable "private_subnet_2" {
  type = any
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "is_release_environment" {
  type = bool
}
