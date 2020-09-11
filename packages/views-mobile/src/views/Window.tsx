import WindowViewInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { Component } from "@react-fullstack/fullstack";

class Window extends Component<WindowViewInterface> {
	render() {
		return this.props.children;
	}
}
export default Window;
