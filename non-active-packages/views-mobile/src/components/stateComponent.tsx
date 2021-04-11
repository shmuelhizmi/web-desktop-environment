import React from "react";

class StateComponent<State extends object> extends React.Component<
	{
		defaultState: State;
		children: (
			state: State,
			setState: (state: Partial<State>, callback?: () => void) => void
		) => JSX.Element;
	},
	State
> {
	realstate = this.props.defaultState;
	state = this.props.defaultState;

	updateState = (state: Partial<State>, callback?: () => void) => {
		this.realstate = { ...this.realstate, ...state };
		this.setState({ ...this.state, ...state }, callback);
	};

	render() {
		return this.props.children(this.realstate, this.updateState);
	}
}

export default StateComponent;
