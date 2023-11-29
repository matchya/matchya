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

  vpc_security_group_ids = [var.rds_security_group.id]
}

## testing new one inside vpc
resource "aws_db_instance" "test" {
  count = 0 # change this to 1 when ready
  db_name = "app"
  identifier = "${terraform.workspace}-test"
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

  vpc_security_group_ids = [var.rds_security_group_new.id]
  db_subnet_group_name   = aws_db_subnet_group.test[0].name
}

resource "aws_db_subnet_group" "test" {
  count = 0 # change this to 1 when ready
  name       = "test"
  subnet_ids = [var.private_subnet_1.id, var.private_subnet_2.id]

  tags = {
    Name = "test"
  }
}
