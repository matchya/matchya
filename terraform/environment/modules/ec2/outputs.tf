output "nat_eip_id" {
  value = var.is_release_environment ? aws_eip.nat[0].id : null
}
