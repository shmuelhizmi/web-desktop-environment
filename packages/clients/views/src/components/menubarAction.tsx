import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Input as MenubarActionProps } from "@web-desktop-environment/interfaces/lib/views/desktop/service";
import Icon from "./icon";
import { useHover } from "@root/hooks/useHover";

const useStyle = makeStyles((theme: Theme) => ({
	root: {
		height: "100%",
		minWidth: 30,
		paddingRight: 5,
		background: "transparent",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		"&:hover": {
			background: theme.background.transparent || theme.background.main,
		},
		position: "relative",
	},
	icon: {
		width: 20,
		height: 20,
		paddingRight: 3,
		paddingLeft: 3,
		color: theme.background.text,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	menu: {
		position: "absolute",
		width: 200,
		borderRadius: 5,
		background: theme.background.transparent || theme.background.main,
		boxShadow: `0px 0px 5px ${theme.shadowColor}`,
		zIndex: 1,
		border: `1px solid ${theme.windowBorderColor}`,
		top: 26,
		left: 5,
	},
	menuItem: {
		width: "100%",
		height: 30,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		"&:hover": {
			background: theme.background.transparent || theme.background.main,
		},
		borderRadius: 5,
	},
	menuItemText: {
		color: theme.background.text,
		fontSize: 12,
		textAlign: "center",
		width: "100%",
	},
}));

export function MenuBarAction(props: MenubarActionProps) {
	const { buttons, icon, onAction, text } = props;
	const { bind: bindHover, isHovered } = useHover();
	const classes = useStyle();
	return (
		<div className={classes.root} {...bindHover}>
			{icon &&
				(icon.type === "img" ? (
					<img src={icon.icon} className={classes.icon} />
				) : (
					<Icon name={icon.icon} className={classes.icon} />
				))}
			<div className={classes.menuItemText}>{text}</div>
			{isHovered && (
				<div className={classes.menu}>
					{buttons.map((button, index) => (
						<div
							key={index}
							onClick={() => onAction(button.id)}
							className={classes.menuItem}
						>
							{button.icon.type === "img" ? (
								<img src={button.icon.icon} className={classes.icon} />
							) : (
								<Icon name={button.icon.icon} className={classes.icon} />
							)}
							<div className={classes.menuItemText}>{button.text}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
