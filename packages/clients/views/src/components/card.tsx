import React, { PropsWithChildren } from "react";
import { makeStyles } from "@mui/styles";
import { ColorVariants } from "@root/theme";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

const useStyle = makeStyles((theme: Theme) => ({
	root: {
		padding: 5,
		borderRadius: 14,
		boxShadow: `-5px 6px 10px -1px ${theme.shadowColor}`,
	},
	mainBackground: {
		background: theme.background.main,
	},
	darkBackground: {
		background: theme.background.dark,
	},
	lightBackground: {
		background: theme.background.light,
	},
	mainBackgroundTransparent: {
		background: theme.background.transparent || theme.background.main,
	},
	darkBackgroundTransparent: {
		background: theme.background.transparentDark || theme.background.dark,
	},
	lightBackgroundTransparent: {
		background: theme.background.transparentLight || theme.background.light,
	},
}));

interface CardProps {
	className?: string;
	colorVariant?: ColorVariants;
}

const Card = ({
	children,
	className,
	colorVariant,
}: PropsWithChildren<CardProps>) => {
	const classes = useStyle();

	const backgroundClassesMap: { [Color in ColorVariants]: string } = {
		dark: classes.darkBackground,
		light: classes.lightBackground,
		main: classes.mainBackground,
		transparent: classes.mainBackgroundTransparent,
		transparentDark: classes.darkBackgroundTransparent,
		transparentLight: classes.lightBackgroundTransparent,
	};
	return (
		<div
			className={`${classes.root} ${
				backgroundClassesMap[colorVariant || "main"]
			} ${className || ""}`}
		>
			{children}
		</div>
	);
};

export default Card;
