import { h, Component } from 'preact';

import Header from './header';

// Code-splitting is automated for routes
import Home from '../routes/home';

export default class App extends Component {

	render() {
		return (
			<div id="app">
				<Header />
				<Home path="/" />
			</div>
		);
	}
}
