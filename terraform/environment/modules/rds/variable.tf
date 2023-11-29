variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

variable "rds_security_group" {
  type = any
}

variable "rds_security_group_new" {
  type = any
}

variable "private_subnet_1" {
  type = any
}

variable "private_subnet_2" {
  type = any
}
