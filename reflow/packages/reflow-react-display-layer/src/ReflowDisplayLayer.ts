import { ReflowTransport, ViewsMapInterface, ReducedViewTree, ViewTreeItem, ReducedViewTreeItem, ViewInterface } from "@web-desktop-environment/reflow";
import { ReflowReactComponentClass, ReflowReactComponentFunction } from "./ReflowReactComponent";
import * as React from "react";

export type ViewsComponents<ViewMap extends ViewsMapInterface> = {
	[T in keyof ViewMap]?: ReflowReactComponentClass<ViewMap[T], any, any> | ReflowReactComponentFunction<ViewMap[T], any>;
};

export default class ReflowDisplayLayer<ViewMap extends ViewsMapInterface> extends React.Component<{ transport: ReflowTransport<any>, views: ViewsComponents<ViewMap> }, { viewTree: ReducedViewTreeItem<ViewsMapInterface, ViewInterface<any, any, any>>[] }> {
	constructor(props) {
		super(props);
		this.props.transport.onViewTree((tree) => {
			this.setState({
				viewTree: tree,
			});
		});
		this.state = {
			viewTree: [],
		};
	}
	viewTreeToElements(viewTree: ReducedViewTreeItem<ViewsMapInterface, ViewInterface<any, any, any>>[]) {
		return viewTree.map((view) => {
			const Component = this.props.views[view.name];
			const input = Object.assign({
				key: view.uid,
				children: this.viewTreeToElements(view.children),
				done: this.props.transport.sendViewDone.bind(this.props.transport, view.uid),
				event: this.props.transport.sendViewEvent.bind(this.props.transport, view.uid),
			}, view.input);
			return React.createElement(Component, input);
		});
	}
	render() {
		return this.viewTreeToElements(this.state.viewTree);
	}
}
