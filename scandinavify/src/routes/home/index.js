import { h, Component } from 'preact';
import style from './style';

class Home extends Component {
	constructor() {
		super();
		this.state = {
			initial: 'Home, sweet home',
			output: ''
		};

		this.handleInput = this.handleInput.bind(this);
		this.transformText = this.transformText.bind(this);
	}

	componentDidMount() {
		this.transformText(this.state.initial);
	}

	handleInput(event) {
		this.transformText(event.target.value);
	}

	transformText(input) {
		// local variable, only in this function
		// RegExp here: `/o/g`, look for all `o` characters
		let output = input.replace(/hello/g, 'hållö');
		output = output.replace(/o/g, 'ø');
		output = output.replace(/ack/g, 'äck');
		output = output.replace(/ard/g, 'ård');
		// alternatively this.setState({ output });
		this.setState({ output: output });
	}

	render() {
		const { initial, output } = this.state;
		return <div class={style.home}>
			<p>Turn your boring words into fun ones!</p>
			<p>The scandinavian languages, have many fun characters. Use them in yours!</p>
			<input type="text" onKeyUp={this.handleInput} placeholder={initial} />
			<div class="result">{output}</div>
		</div>;
	}
}

export default Home;
