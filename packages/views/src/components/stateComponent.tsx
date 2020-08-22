import React from "react";

class StateComponent<State extends object> extends React.Component<
	{
		defaultState: State;
		onMount?: (state: State, setState: (state: Partial<State>) => void) => void;
		children: (
			state: State,
			setState: (state: Partial<State>) => void
		) => JSX.Element;
	},
	State
> {
	realstate = this.props.defaultState;
	state = this.props.defaultState;

	updateState = (state: Partial<State>) => {
		this.setState({ ...this.state, ...state });
		this.realstate = { ...this.realstate, ...state };
	};

	componentDidMount = () => {
		if (this.props.onMount) {
			this.props.onMount(this.realstate, this.updateState);
		}
	};

	render() {
		return this.props.children(this.realstate, this.updateState);
	}
}

export default StateComponent;
