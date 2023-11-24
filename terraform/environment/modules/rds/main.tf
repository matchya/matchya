resource "aws_db_instance" "this" {
  db_name = "${terraform.workspace}"
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

  vpc_security_group_ids = [var.rds_security_group_id]
}
