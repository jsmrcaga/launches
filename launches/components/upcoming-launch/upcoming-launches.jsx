import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Style from './upcoming-launches.module.css';
import Rocket from '../../public/rocket.png';
import Telegram from '../../public/telegram.png';

export default function UpcomingLaunch({ launches }) {
	const [next_launch] = launches;

	return (
		<div className={Style.container}>
			<div>
				<Image width={150} height={150} className={Style.rocket} src={Rocket} alt="Rocket"/>
				<div className={Style.mission}>Mission: {next_launch.missions[0].name}</div>
				<div className={Style.vehicle}>{next_launch.vehicle.name}</div>
				<div className={Style.provider}>{next_launch.provider.name}</div>
				<div className={Style.description}>{next_launch.launch_description}</div>
				{next_launch.to && <div className={Style.date}>{next_launch.t0}</div>}

				<a className={Style.tg} href="https://t.me/rocket_launches_live_bot" target="_blank" rel="noreferrer">
					<Image width={512/3} height={134/3} className={Style.tg} src={Telegram} alt="Telegram"/>
				</a>
				<div className={Style['powered-by']}>Powered by <a href="https://www.rocketlaunch.live/" target="_blank" rel="noreferrer">Rocket Launch Live</a></div>
			</div>
		</div>
	);
}
