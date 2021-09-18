const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

addEventListener('fetch', (event) => {
	// handle preflight
	if(event.request.method === 'OPTIONS') {
		return event.respondWith(new Response(null, {
			headers: {
				...CORS,
				"Access-Control-Allow-Headers": event.request.headers.get("Access-Control-Request-Headers"),
			}
		}));
	}

	return event.respondWith(
		fetch('https://fdo.rocketlaunch.live/json/launches/next/5').then(response => {
			return new Response(response.body, {
				...response,
				headers: {
					...response.headers,
					...CORS,
					"Access-Control-Allow-Headers": event.request.headers.get("Access-Control-Request-Headers"),
				}
			});
		})
	);
});
