output "nat_eip_id" {
  value = terraform.workspace != "dev" ? aws_eip.nat[0].id : null
}
