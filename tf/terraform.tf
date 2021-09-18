terraform {
    required_providers {
        cloudflare = {
            source  = "cloudflare/cloudflare"
            version = "~> 2.0"
        }
    }
}

provider "cloudflare" {
    email   = var.cloudflare_email
    api_key = var.cloudflare_api_key
    account_id = var.cloudflare_account_id
}
