import { h, Component } from 'preact';
import style from './style';

export default class Home extends Component {
	state = {
		items: [],
		price: null,
		display: false
	}

	constructor() {
		super();

		this.calc = this.calc.bind(this);
	}

	componentDidMount() {
		try {
			const fromLocalStorage = JSON.parse(localStorage.getItem('store'));
			this.setState({ items: fromLocalStorage })
		} catch (e) {
			console.log(e)
			// could not recover from localStorage, default list is empty
		}
	}

	calc(e) {
		let display;

		if (!e.target.value || e.target.value.length === 0) {
			display = false;
		} else {
			display = true;
		}

		this.setState({ price: parseInt(e.target.value, 10), display })
	}

	render() {
		const { items, price, display } = this.state;
		console.log(items)
		const listItems = items.map((listItem) =>
			<li>{parseFloat(price / listItem.value).toFixed(2)}x a  {listItem.name}</li>
		);

		let result;

		if (display === true) {
			result = (
				<div>
					<p>That's:</p>
					<ul>
						{listItems}
					</ul>
				</div>
			)
		}

		return (
			<div class={style.home}>
				<h1>How much does it cost?</h1>
				<input type="text" onKeyUp={this.calc} />
				{result}
			</div>
		)
	}
};
