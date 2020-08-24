import { ReflowReactComponent } from "@web-desktop-environment/reflow-react-display-layer";
import WindowViewInterface from "@web-desktop-environment/interfaces/lib/views/Window";

class Window extends ReflowReactComponent<WindowViewInterface> {
	render() {
		return this.props.children;
	}
}
export default Window;
