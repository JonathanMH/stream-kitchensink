import './style';
import { Component, createRef } from 'preact';

import CountUp from './countup.js';

export default class App extends Component {
	state = {
		renderCountUps: false
	};

	constructor() {
		super();
		// the element that contains all intersect observed elements
		this.rootRef = createRef();
		// elements inside the wrap to be hidden until in viewport
		this.wrapRef = createRef();

		this.showCountUps = this.showCountUps.bind(this);

		this.observer = new IntersectionObserver(this.showCountUps, {
			root: this.rootRef.current,
			threshhold: 1
		});
	}

	showCountUps(entries) {
		console.log('intersecting!')
		if (entries[0].intersectionRatio !== 0) {
			this.setState({ renderCountUps: true });
		}
	}

	componentDidMount() {
		this.observer.observe(this.wrapRef.current);
	}

	render() {
		let { renderCountUps } = this.state;

		let onScrollComponent = null;

		if (renderCountUps) {
			onScrollComponent = (<CountUp
				finalValue="76"
				duration="1000"
			/>)
		}

		return (
			<div>
				<div ref={this.rootRef}>
					<div class="spacer"></div>
					<div ref={this.wrapRef}>
						{onScrollComponent}
					</div>
					<div class="spacer"></div>
				</div>
			</div>
		);
	}
}
