resource "aws_ssm_parameter" "checklist_generation_processor_queue_arn" {
  name  = "/terraform/${terraform.workspace}/sqs/checklist_generation_processor_queue_arn"
  type  = "String"
  value = aws_sqs_queue.checklist_generation_processor_queue.arn
}

resource "aws_ssm_parameter" "checklist_generation_processor_queue_url" {
  name  = "/terraform/${terraform.workspace}/sqs/checklist_generation_processor_queue_url"
  type  = "String"
  value = aws_sqs_queue.checklist_generation_processor_queue.url
}

resource "aws_ssm_parameter" "checklist_evaluation_processor_queue_arn" {
  name  = "/terraform/${terraform.workspace}/sqs/checklist_evaluation_processor_queue_arn"
  type  = "String"
  value = aws_sqs_queue.checklist_evaluation_processor_queue.arn
}

resource "aws_ssm_parameter" "checklist_evaluation_processor_queue_url" {
  name  = "/terraform/${terraform.workspace}/sqs/checklist_evaluation_processor_queue_url"
  type  = "String"
  value = aws_sqs_queue.checklist_evaluation_processor_queue.url
}

resource "aws_ssm_parameter" "question_generation_processor_queue_arn" {
  name  = "/terraform/${terraform.workspace}/sqs/question_generation_processor_queue_arn"
  type  = "String"
  value = aws_sqs_queue.question_generation_processor_queue.arn
}

resource "aws_ssm_parameter" "question_generation_processor_queue_url" {
  name  = "/terraform/${terraform.workspace}/sqs/question_generation_processor_queue_url"
  type  = "String"
  value = aws_sqs_queue.question_generation_processor_queue.url
}
