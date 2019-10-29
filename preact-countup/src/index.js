import './style';
import { Component, createRef } from 'preact';

import CountUp from './countup.js';
import IsVisible from './isVisible';

export default class App extends Component {
	state = {
		renderCountUps: false
	};

	constructor() {
		super();
	}

	customFn() {
		const oneDayIsh = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const beginning = new Date(2019, 6, 1);
		const today = new Date();
		const diffDays = Math.round(Math.abs((today - beginning) / oneDayIsh));

		const minutes = ((diffDays / 7) * 5) * 7 * 2;

		return minutes;
	}

	render() {
		return (
			<div>
				<div>
					<div class="spacer"></div>
					<div>
						<IsVisible>
							<CountUp
								finalValue="76"
								duration="1000"
								customFn={this.customFn}
							/>
						</IsVisible>
						<div class="tiny-spacer"></div>
						<IsVisible >
							<CountUp
								finalValue="1500"
								duration="1000"
							/>
						</IsVisible>
						<div class="tiny-spacer"></div>
						<IsVisible>
							<CountUp
								finalValue="9000"
								duration="1000"
							/>
						</IsVisible>
					</div>
					<div class="spacer"></div>
				</div>
			</div>
		);
	}
}
