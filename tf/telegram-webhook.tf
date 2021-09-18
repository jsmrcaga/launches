resource null_resource telegram_webhook {
  provisioner "local-exec" {
    command = "${path.module}/scripts/set-bot-token.sh"
    environment = {
      BOT_TOKEN = var.telegram_bot_token
      BOT_URL =  local.telegram_bot_webhook
    }
  }
}
