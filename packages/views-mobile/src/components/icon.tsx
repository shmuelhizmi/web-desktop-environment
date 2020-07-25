import React from "react";

import { IconProps as IconCompoentProps } from "react-native-vector-icons/Icon";
import { NativeIcon } from "@web-desktop-environment/interfaces/lib/shared/icon";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Zocial from "react-native-vector-icons/Zocial";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import RNIMigration from "react-native-vector-icons/RNIMigration";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

type IconProps = Partial<IconCompoentProps> & {
	icon: NativeIcon;
};

const Icon = (props: IconProps) => {
	const icons = {
		AntDesign,
		Entypo,
		EvilIcons,
		Feather,
		FontAwesome,
		FontAwesome5,
		Fontisto,
		Foundation,
		Zocial,
		SimpleLineIcons,
		RNIMigration,
		Octicons,
		MaterialIcons,
		MaterialCommunityIcons,
		Ionicons,
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	return React.createElement(icons[props.icon.type], {
		...props,
		name: props.icon.icon,
	});
};

export default Icon;
