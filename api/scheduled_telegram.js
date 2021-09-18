const format_message = ({ vehicle: { name }, provider: { name: pname }, t0 }) => {
	const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' });

	return `A new launch is scheduled soon!\n${pname} will be launching a ${name} vehicle on ${formatter.format(new Date(t0))}`;
};

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
				console.error('Error sending message', text, response.status);
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

const get_next_launch = () => {
	return fetch('https://fdo.rocketlaunch.live/json/launches/next/5').then(response => {
		return response.json();
	}).then(json => {
		return json;
	});
};

const check_and_notify = () => {
	return get_next_launch().then(({ result: launches }) => {
		const [next_launch] = launches;

		if(!next_launch.t0) {
			// No need to trigger messages
			return [null, null];
		}
		// verify timing
		return Promise.all([TELEGRAM_KV.get('telegram-subscriptions'), next_launch]);
	}).then(([subscriptions, launch]) => {
		if(!subscriptions) {
			return;
		}

		if(!launch) {
			return;
		}

		// Send telegram messages
		return Promise.all(JSON.parse(subscriptions).map(subscription => {
			return send_telegram_message({
				chat_id: subscription,
				message: format_message(launch)
			}).catch(e => {
				console.error(e);
			});
		}));
	});
};

addEventListener('scheduled', (event) => {
	event.waitUntil(check_and_notify());
});
