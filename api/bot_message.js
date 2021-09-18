const KV_KEY = 'telegram-subscriptions';

const send_telegram_message = ({ chat_id, message }) => {
	return fetch(`https://api.telegram.org/bot${BOT_API_KEY}/sendMessage`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id,
			text: message
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => {
		if(![200, 201].includes(response.status)) {
			return response.text().then(text => {
				console.error('Error sending message', message, text, response.status);
				return new Response('', {
					status: 500
				});
			});
		}

		return new Response('', {
			status: 200
		});
	});
};

const subscribe = (chat_id) => {
	return TELEGRAM_KV.get(KV_KEY).then(subscriptions => {
		if(!subscriptions) {
			return TELEGRAM_KV.put(KV_KEY, JSON.stringify([chat_id]));
		}

		const subs = JSON.parse(subscriptions);

		if(subs.includes(chat_id)) {
			return send_telegram_message({
				chat_id,
				message: 'You are already subscribed!'
			});
		}

		subs.push(chat_id);

		return TELEGRAM_KV.put(KV_KEY, JSON.stringify(subs)).then(() => {
			return send_telegram_message({
				chat_id,
				message: 'Thanks! You are now subscribed!'
			});
		});
	});
};

const respond_to_message = (request) => {
	return request.json().then(({ message }) => {
		const { from, chat: { id: chat_id }, text, entities=[] } = message;


		const command = entities.find(e => e.type === 'bot_command');

		if(!command) {
			return send_telegram_message({
				chat_id,
				message: 'I can\'t yet answer text messages, but if you have subscribed I\'ll notify you when a launch is nearing'
			});
		}

		const entity = text.slice(command.offset, command.offset + command.length)

		if(!/subscribe/.test(entity)) {
			return send_telegram_message({
				chat_id,
				message: 'Only /subscribe is supported at this time'
			});
		}

		return subscribe(chat_id);
	});
}

addEventListener('fetch', event => {
	// Get data and respond with bot
	event.respondWith(respond_to_message(event.request));
});
