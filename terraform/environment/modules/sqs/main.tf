resource "aws_sqs_queue" "criteria_generate_queue" {
  name                      = "${terraform.workspace}-criteria-generate"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
}

