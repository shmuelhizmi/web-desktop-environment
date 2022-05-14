import React from "react";
import { makeStyles } from "@mui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

const useStyle = makeStyles((theme: Theme) => ({
	root: {
		width: "100%",
		height: 25,
		background: theme.background.transparent || theme.background.main,
		display: "flex",
		alignItems: "center",
	},
}), { name: "MenuBar" });

export function MenuBar(
	props: React.PropsWithChildren<{ div: React.Ref<HTMLDivElement> }>
) {
	const classes = useStyle();
	return (
		<div ref={props.div} className={classes.root}>
			{props.children}
		</div>
	);
}
