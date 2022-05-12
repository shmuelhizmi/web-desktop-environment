import React from "react";
import { Component, View } from "@react-fullstack/fullstack";

export function asFullStackView<T extends View<any>>(
	Comp: React.FunctionComponent<T["props"]>
): new (props: T["props"]) => Component<T> {
	// eslint-disable-next-line react/display-name
	return class extends Component<T> {
		render() {
			return React.createElement(Comp, this.props);
		}
	};
}
