import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import DesktopInterface, {
	App,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { View, Text } from "react-native";

class Desktop extends ReflowReactComponent<DesktopInterface> {
	render() {
		return <View>
			<Text>{this.props.apps} apps running</Text>
		</View>
	}
}

export default Desktop;