module "iam" {
  source = "./modules/iam"

  create_new = true
}

module "route53" {
  source = "./modules/route53"

  hosted_zone = var.hosted_zone
  google_workspace_records = var.google_workspace_records
  webflow_records = var.webflow_records
  www_webflow_records = var.www_webflow_records
}
