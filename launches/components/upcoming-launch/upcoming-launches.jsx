import React from 'react';

import Link from 'next/link';

import Style from './upcoming-launches.module.css';
import Rocket from '../../public/rocket.png';
import Telegram from '../../public/telegram.png';

export default function UpcomingLaunch({ launches }) {
	const [next_launch] = launches;

	return (
		<div className={Style.container}>
			<div>
				<img className={Style.rocket} src={Rocket.src} alt="Rocket"/>
				<div className={Style.info}>Next scheduled launch:</div>
				<div className={Style.mission}>Mission: {next_launch.missions[0].name}</div>
				<div className={Style.vehicle}>{next_launch.vehicle.name}</div>
				<div className={Style.provider}>{next_launch.provider.name}</div>
				<div className={Style.description}>{next_launch.launch_description}</div>
				{next_launch.to && <div className={Style.date}>{next_launch.t0}</div>}

				<a className={Style.tg} href="https://t.me/rocket_launches_live_bot" target="_blank" rel="noreferrer">
					<div style={{marginTop: '25px'}}  className={Style.info}>Get real time updates on telegram:</div>
					<img width={512/3} height={134/3} className={Style.tg} src={Telegram.src} alt="Telegram"/>
				</a>
				<div className={Style['powered-by']}>⚡️ Powered by <a href="https://www.rocketlaunch.live/" target="_blank" rel="noreferrer">Rocket Launch Live</a></div>
			</div>
		</div>
	);
}
