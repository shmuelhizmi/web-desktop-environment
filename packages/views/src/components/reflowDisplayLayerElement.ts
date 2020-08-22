import {
	ViewsMapInterface,
	ReflowTransport,
} from "@web-desktop-environment/reflow";
import { ViewsComponents } from "@mcesystems/reflow-react-display-layer/dist/ReflowDisplayLayer";
import { ReflowDisplayLayerElement as BaseElement } from "@mcesystems/reflow-react-display-layer";

interface ReactReflowDisplayLayerElementProps<
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
> {
	transport: ReflowTransport<ViewerParameters>;
	views: ViewsComponents<ViewMap>;
	wrapper?: React.ComponentClass<ViewerParameters>;
}
type ReflowDisplayLayerElementType = <
	ViewMap extends ViewsMapInterface,
	ViewerParameters = {}
>({
	views,
	transport,
	wrapper,
}: ReactReflowDisplayLayerElementProps<
	ViewMap,
	ViewerParameters
>) => JSX.Element;

export const ReflowDisplayLayerElement = (BaseElement as unknown) as ReflowDisplayLayerElementType;
