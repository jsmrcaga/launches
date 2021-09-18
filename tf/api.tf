locals {
	telegram_kv_name = "TELEGRAM_KV"
	telegram_bot_webhook = "launches.jocolina.com/api/bot"
}

resource cloudflare_workers_kv_namespace telegram_kv {
	title = local.telegram_kv_name
}

# ---------------------
#       LAUNCHES
# ---------------------
resource cloudflare_worker_script get_launches {
	name = "get_launches"
	content = file("../api/get_launches.js")
}

resource cloudflare_worker_route get_launches {
	zone_id = var.cloudflare_zone_id
	pattern = "launches.jocolina.com/api/launches"
	script_name = cloudflare_worker_script.get_launches.name
}

# ---------------------
#    	BOT Messages
# ---------------------
resource cloudflare_worker_script bot_message {
	name = "bot_message"
	content = file("../api/bot_message.js")

	kv_namespace_binding {
		name = local.telegram_kv_name
		namespace_id = cloudflare_workers_kv_namespace.telegram_kv.id
	}

	secret_text_binding {
		name = "BOT_API_KEY"
		text = var.telegram_bot_token
	}
}

resource cloudflare_worker_route bot_message {
	zone_id = var.cloudflare_zone_id
	pattern = local.telegram_bot_webhook
	script_name = cloudflare_worker_script.bot_message.name
}


# ---------------------
#    	CRON Messages
# ---------------------
resource cloudflare_worker_script scheduled_bot_messages {
	name = "scheduled_bot_messages"
	content = file("../api/scheduled_telegram.js")

	kv_namespace_binding {
		name = local.telegram_kv_name
		namespace_id = cloudflare_workers_kv_namespace.telegram_kv.id
	}

	secret_text_binding {
		name = "BOT_API_KEY"
		text = var.telegram_bot_token
	}
}

resource cloudflare_worker_cron_trigger bot_trigger {
	script_name = cloudflare_worker_script.scheduled_bot_messages.name
	schedules = [
		"0 * * * *" // evrey hour
	]
}
