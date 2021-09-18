addEventListener('fetch', (event) => {
	event.respondWith(
		fetch('https://fdo.rocketlaunch.live/json/launches/next/5')
	);
});
