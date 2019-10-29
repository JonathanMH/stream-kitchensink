import { h, Component } from 'preact';
import style from './style';

export default class List extends Component {
	constructor() {
		super();
		this.addItem = this.addItem.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	state = {
		name: '',
		value: 0,
		items: []
	};

	componentDidMount() {
		try {
			const fromLocalStorage = JSON.parse(localStorage.getItem('store'));
			this.setState({ items: fromLocalStorage })
		} catch (e) {
			console.log(e)
			// could not recover from localStorage, default list is empty
		}
	}

	addItem(e) {
		e.preventDefault();
		const { items } = this.state;
		items.push({ name: this.state.name, value: this.state.value });
		this.setState({ items }, () => {
			localStorage.setItem('store', JSON.stringify(this.state.items))
		});
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value })
	}

	render() {
		const { items } = this.state;
		const listItems = items.map((listItem) =>
			<li>{listItem.name} - {listItem.value}</li>
		);

		return (
			<div class={style.list}>
				<h2>Add Item</h2>
				<form onSubmit={this.addItem} >
					<input id="name" placeholder="longboard" type="text" onKeyUp={this.handleChange} />
					<input id="value" placeholder="700" type="text" onKeyUp={this.handleChange} />
					<input type="submit" value="Add" />
				</form>
				<h2>List</h2>

				<ul>
					{listItems}
				</ul>

			</div>
		);
	}
}
