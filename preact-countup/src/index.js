import './style';
import { Component } from 'preact';

import CountUp from './countup.js';

export default class App extends Component {
	render() {
		return (
			<div>
				<CountUp
					finalValue="30"
					duration="10000"
				/>
				<CountUp finalValue="642" />
			</div>
		);
	}
}
