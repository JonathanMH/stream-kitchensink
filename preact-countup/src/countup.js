import './style';
import { Component } from 'preact';

export default class CountUp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: 0,
			frameRate: 33,
			duration: 1000,
		}

		if (this.props.duration) {
			this.state.duration = this.props.duration;
		}

		if (this.props.finalValue) {
			this.state.finalValue = this.props.finalValue;
		}

		if (this.props.customFn) {
			this.state.finalValue = this.props.customFn();
		}

		this.iterateValue = this.iterateValue.bind(this);
	}

	componentDidMount() {
		console.log('mounting counter', this.state.finalValue);
		this.state.interval = setInterval(this.iterateValue, this.state.frameRate)
	}

	iterateValue() {
		const { currentValue, duration, frameRate, interval, finalValue } = this.state;

		let split = Math.abs(finalValue / (duration / frameRate));

		if (currentValue < parseInt(finalValue, 10)) {
			const newValue = currentValue + split;
			this.setState({ currentValue: newValue });
		} else {
			this.setState({ currentValue: finalValue });
			clearInterval(interval);
		}
	}

	render() {
		return (
			<div class="countup" >
				<div class="value">
					{Math.round(this.state.currentValue, 0)}
				</div>
			</div>
		)
	}

}