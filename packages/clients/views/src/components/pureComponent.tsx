import {
	TransformViewProps,
	View as ViewType,
} from "@react-fullstack/fullstack/lib/Views";
import React from "react";

export abstract class PureComponent<
	View extends ViewType<any>,
	State = {},
	ExternalProps = {}
> extends React.PureComponent<
	TransformViewProps<View["props"]> & ExternalProps,
	State
> {}
