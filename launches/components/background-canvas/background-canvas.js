import React from 'react';

import Style from './background-canvas.module.css';

// Pre-generate stars
let sky = null;
const random_star_color = () => {
	return `rgba(255, 255, 255, ${Math.random() + 0.1})`;
};

class Star {
	constructor({ sky }) {
		const rx = Math.floor(Math.random() * sky.width);
		const ry = Math.floor(Math.random() * sky.height);

		this.position = {
			x: rx,
			y: ry
		};

		this.radius = Math.random() * 2 + 2;
		this.color = random_star_color();
	}

	draw(ctx) {
		ctx.fillStyle = this.color;

		const { x, y } = this.position;
		const { radius } = this;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

class Sky {
	constructor({ width, height, stars=300 }={}) {
		// Singleton
		if(sky !== null) {
			return sky;
		}

		this.width = width;
		this.height = height;

		this.stars = [];
		this.star_quantity = stars;

		sky = this;
	}

	getStars() {
		if(!this.stars.length) {
			this.generateSky(this.star_quantity);
		}

		return this.stars.slice(0, this.star_quantity);
	}

	generateSky() {
		// Clear stars
		this.stars = [];
		for(let i = 0; i < this.star_quantity; i++) {
			this.stars.push(new Star({ sky: this }));
		}
	}

	draw(ctx) {
		const { width, height } = this;
		const w = (width / 2) * -1;
		const h = (height / 2) * -1;
		const x = width * 2;
		const y = height *2;

		ctx.fillStyle = 'black';
		ctx.clearRect(w, h, x, y);
		ctx.fillRect(w, h, x, y);

		for(let star of this.getStars()) {
			star.draw(ctx);
		}
	}
}

export default function BackgroundCanvas() {
	const canvasRef = React.useRef(null);
	const contextRef = React.useRef(null);

	React.useEffect(() => {
		if(!canvasRef.current) {
			return;
		}

		const ctx = canvasRef.current.getContext('2d');
		contextRef.current = ctx;

		canvasRef.current.width = window.innerWidth;
		canvasRef.current.height = window.innerHeight;

		const { height, width } = canvasRef.current;

		// Draw canvas background
		const starsQtty = Math.floor(Math.random() * 300);

		const sky = new Sky({ width, height, stars: starsQtty });
		sky.draw(ctx);
	}, [canvasRef]);

	React.useEffect(() => {
		const listener = e => {
			if(!canvasRef.current) {
				return;	
			}

			const middle = {
				x: window.innerWidth / 2,
				y: window.innerHeight / 2
			};

			const { x, y } = e;

			const tx = (middle.x - x) / 20;
			const ty = (middle.y - y) / 20;

			canvasRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
		}

		window.addEventListener('mousemove', listener);

		return () => window.removeEventListener('mousemove', listener);
	}, [canvasRef, contextRef]);

	React.useEffect(() => {
		const listener = e => {
			if(!canvasRef.current) {
				return;
			}

			let {
				alpha, // rotation axis is . --> rotate image // does not work
				beta, // rotation axis is <-> --> translate x // apparenly not
				gamma // rotation axis is i --> translate y // apparently not
			} = e;

			const MAX_DEG = 30;

			alpha = (alpha / Math.abs(alpha)) * Math.min(Math.abs(alpha), MAX_DEG);
			beta = (beta / Math.abs(beta)) * Math.min(Math.abs(beta), MAX_DEG);
			gamma = (gamma / Math.abs(gamma)) * Math.min(Math.abs(gamma), MAX_DEG);

			const tx = gamma;
			const ty = beta;

			canvasRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
		}

		window.addEventListener('deviceorientation', listener);

		return () => window.removeEventListener('deviceorientation', listener);
	}, [canvasRef, contextRef]);

	return (
		<canvas id="bg-canvas" className={Style.canvas} ref={canvasRef}/>
	);
}
