import React, { PropsWithChildren } from "react";
import { useTheme, makeStyles } from "@material-ui/styles";
import { Theme, Colors } from "@root/theme";

const useStyle = (
	textColor: string,
	backgroundColor: string,
	backgroundColorHover: string,
	border: string
) =>
	makeStyles((theme: Theme) => ({
		root: {
			borderRadius: 4,
			minHeight: 35,
			minWidth: 80,
			padding: 4,
			display: "flex",
			justifyContent: "center",
			color: textColor,
			background: backgroundColor,
			border,
			alignItems: "center",
			cursor: "pointer",
			"&:hover": {
				border,
				backgroundBlendMode: "multiply",
				backgroundColor: backgroundColorHover,
			},
		},
		shadow: {
			boxShadow: `-3px 4px 6px -1px ${theme.shadowColor}`,
		},
	}));

type Variants = "main" | "dark" | "light";

interface ButtonProps {
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	className?: string;
	color?: Colors;
	variant?: Variants;
	border?: boolean;
	transparent?: boolean;
	shadow?: boolean;
}

const Button = ({
	children,
	className,
	color,
	variant,
	border,
	transparent,
	onClick,
	shadow,
}: PropsWithChildren<ButtonProps>) => {
	const theme: Theme = useTheme();
	const selectedColor = theme[color || "background"];
	const textColor = selectedColor.text;
	const borderValue = border ? `1px solid ${textColor}` : "none";
	const backgroundColorMap: { [Variant in Variants]: string } = {
		dark: selectedColor.transparentDark || selectedColor.dark,
		main: selectedColor.transparent || selectedColor.main,
		light: selectedColor.transparentLight || selectedColor.light,
	};
	const backgroundColor =
		transparent !== true
			? backgroundColorMap[variant || "main"] ||
			  selectedColor.transparent ||
			  selectedColor.main
			: "transparent";
	const backgroundColorHover =
		selectedColor[variant || "main"] || selectedColor.main;
	const classes = useStyle(
		textColor,
		backgroundColor,
		backgroundColorHover,
		borderValue
	)();

	return (
		<div
			onClick={onClick}
			className={`${classes.root} ${shadow ? classes.shadow : ""} ${
				className || ""
			}`}
		>
			{children}
		</div>
	);
};

export default Button;
