import {
	ReflowTransport,
	ViewsMapInterface,
} from "@web-desktop-environment/reflow";
import { render } from "react-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import ReflowDisplayLayer, { ViewsComponents } from "./ReflowDisplayLayer";

export * from "./ReflowReactComponent";

export interface ReactReflowOptions<
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
> {
	transport: ReflowTransport<ViewerParameters>;
	element: Element;
	views: ViewsComponents<ViewMap>;
	wrapper?: React.ComponentClass<ViewerParameters>;
}

export interface ReactReflowDisplayLayerElementProps<
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
> {
	transport: ReflowTransport<ViewerParameters>;
	views: ViewsComponents<ViewMap>;
	wrapper?: React.ComponentClass<ViewerParameters>;
}

export const ReflowDisplayLayerElement = <
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
>({
	views,
	transport,
	wrapper,
}: ReactReflowDisplayLayerElementProps<ViewMap, ViewerParameters>) => {
	const Wrapper = (wrapper || React.Fragment) as typeof wrapper;
	const [viewerParams, setViewerParams] = useState({} as ViewerParameters);

	useEffect(() => {
		transport.onViewerParameters((params) => {
			setViewerParams(params);
		});

		transport.initializeAsDisplay();
	}, [transport]);

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		<Wrapper {...viewerParams}>
			<ReflowDisplayLayer transport={transport} views={views} />
		</Wrapper>
	);
};

export function renderDisplayLayer<
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
>({
	transport,
	element,
	views,
	wrapper,
}: ReactReflowOptions<ViewMap, ViewerParameters>) {
	render(
		<ReflowDisplayLayerElement
			views={views}
			transport={transport}
			wrapper={wrapper}
		/>,
		element
	);
}
