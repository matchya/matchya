# Dev environment
resource "aws_db_instance" "insecure" {
  count = terraform.workspace == "dev" ? 1 : 0
  db_name = terraform.workspace
  identifier = terraform.workspace
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = true
  publicly_accessible = true

  vpc_security_group_ids = [var.rds_postgres_insecure_security_group[0].id]
}

# Staging/Production environment
resource "aws_db_instance" "secure" {
  count = terraform.workspace != "dev" ? 1 : 0
  db_name = terraform.workspace
  identifier = terraform.workspace
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = false
  publicly_accessible = false
  auto_minor_version_upgrade = terraform.workspace == "staging"
  maintenance_window      = "Fri:09:00-Fri:09:30"
  backup_retention_period = 7

  vpc_security_group_ids = [var.rds_postgres_secure_security_group[0].id]
  db_subnet_group_name   = aws_db_subnet_group.secure[0].name
  final_snapshot_identifier = "${terraform.workspace}-final-snapshot-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
}

resource "aws_db_subnet_group" "secure" {
  count = terraform.workspace != "dev" ? 1 : 0
  name       = terraform.workspace
  subnet_ids = [var.private_subnet_1[0].id, var.private_subnet_2[0].id]
}
