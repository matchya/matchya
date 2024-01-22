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

module "ses" {
  source = "./modules/ses"

  hosted_zone_id = module.route53.main_route53_zone.id
  hosted_zone = var.hosted_zone
}
