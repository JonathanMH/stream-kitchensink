import { Component, createRef } from "preact";

export default class isVisible extends Component {
	constructor() {
		super();
		this.state = {
			inViewport: false
		}

		this.rootRef = createRef();
		this.innerRef = createRef();

		this.observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.intersectionRatio > 0) {
					this.setState({ inViewport: true });
					return;
				}
			})
		}, {
			root: this.rootRef.current,
			threshhold: 1
		});
	}

	componentDidMount() {
		console.log(this.props.children);
		this.observer.observe(this.innerRef.current);
	}

	render() {
		const { inViewport } = this.state;
		console.log(`inViewport, ${inViewport}`)

		return (
			<div id={this.props.id} ref={this.rootRef}>
				<div ref={this.innerRef}>
					{inViewport ? this.props.children : null}
				</div>
			</div>
		)
	}

}