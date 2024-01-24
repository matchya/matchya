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
  sendgrid_cname_1_name = var.sendgrid_cname_1_name
  sendgrid_cname_1_record = var.sendgrid_cname_1_record
  sendgrid_cname_2_name = var.sendgrid_cname_2_name
  sendgrid_cname_2_record = var.sendgrid_cname_2_record
  sendgrid_cname_3_name = var.sendgrid_cname_3_name
  sendgrid_cname_3_record = var.sendgrid_cname_3_record
  sendgrid_cname_4_name = var.sendgrid_cname_4_name
  sendgrid_cname_4_record = var.sendgrid_cname_4_record
  sendgrid_cname_5_name = var.sendgrid_cname_5_name
  sendgrid_cname_5_record = var.sendgrid_cname_5_record
  sendgrid_txt_name = var.sendgrid_txt_name
  sendgrid_txt_record = var.sendgrid_txt_record
}

module "ses" {
  source = "./modules/ses"

  hosted_zone_id = module.route53.main_route53_zone.id
  hosted_zone = var.hosted_zone
}
