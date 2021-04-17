import React from "react";
import { IconBaseProps } from "react-icons";
import * as FcIcons from "react-icons/fc";
import * as VSCIcons from "react-icons/vsc";
import { IconBase } from "react-icons/lib/cjs/iconBase";
import { IconNames } from "@web-desktop-environment/interfaces/lib/shared/icon";
import "./icon.css";

const Icon = (
	props: IconBaseProps & {
		name: IconNames;
		containerClassName?: string;
		parentFill?: boolean;
	}
) => {
	return (
		<span className={`icon-parent ${props.containerClassName || ""}`}>
			{React.createElement(
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				{ ...FcIcons, ...VSCIcons }[props.name] || IconBase,
				props
			)}
		</span>
	);
};
export default Icon;
