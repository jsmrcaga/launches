import React from 'react';
import Head from 'next/head';

import UpcomingLaunch from '../components/upcoming-launch/upcoming-launches';
import BackgroundCanvas from '../components/background-canvas/background-canvas';

export default function Home() {
	const [ launches, setLaunches ] = React.useState(null);

	React.useEffect(() => {
		fetch('https://launches.jocolina.com/api/launches').then(response => {
			return response.json();
		}).then(({ result }) => {
			console.warn('RESULT', result);
			return setLaunches(result);
		});
	}, []);

	return (
		<div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
			<Head>
				<title>Upcomng Rocket Launches</title>
				<meta name="description" content="Live data of upcoming rocket launches" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<BackgroundCanvas/>
			{launches && <UpcomingLaunch launches={launches}/>}
		</div>
	)
}
