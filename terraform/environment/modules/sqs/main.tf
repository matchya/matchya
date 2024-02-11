resource "aws_sqs_queue" "checklist_generation_processor_queue" {
  name                      = "${terraform.workspace}-checklist-generation-processor-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  visibility_timeout_seconds = 300

  tags = {
    Environment = "${terraform.workspace}"
  }
}

resource "aws_sqs_queue" "checklist_evaluation_processor_queue" {
  name                      = "${terraform.workspace}-checklist-evaluation-processor-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  visibility_timeout_seconds = 300

  tags = {
    Environment = "${terraform.workspace}"
  }
}

resource "aws_sqs_queue" "question_generation_processor_queue" {
  name                      = "${terraform.workspace}-question-generation-processor-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  visibility_timeout_seconds = 300

  tags = {
    Environment = "${terraform.workspace}"
  }
}
