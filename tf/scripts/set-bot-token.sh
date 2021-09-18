#!/bin/bash
curl -f -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook"\
	-d "{ \"url\":\"https://$BOT_URL\" }"\
	-H "Content-Type: application/json"
