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

  vpc_security_group_ids = [var.rds_postgres_insecure_security_group.id]
}

# Staging/Production environment
resource "aws_db_instance" "secure" {
  count = terraform.workspace == "dev" ? 0 : 1
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
  publicly_accessible = false

  vpc_security_group_ids = [var.rds_postgres_secure_security_group.id]
  db_subnet_group_name   = aws_db_subnet_group.secure[0].name
}

resource "aws_db_subnet_group" "secure" {
  count = terraform.workspace == "dev" ? 0 : 1
  name       = terraform.workspace
  subnet_ids = [var.private_subnet_1.id, var.private_subnet_2.id]
}
