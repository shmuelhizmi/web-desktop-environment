import React, { useState, PropsWithChildren } from "react";
import { useTheme, makeStyles } from "@material-ui/styles";
import { Colors, ColorVariants } from "@root/theme";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

const useStyle = (
	textColor: string,
	backgroundColor: string,
	border: string,
	borderBottom: string
) =>
	makeStyles(() => ({
		root: {
			maxHeight: 35,
			fontSize: 25,
			color: textColor,
			backgroundColor,
			border,
			borderBottom,
			"&:focus": {
				outline: "none",
			},
		},
	}));

interface TextFieldProps {
	onChange?: (newValue: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string | number | string[] | undefined;
	placeholder?: string;
	className?: string;
	color?: Colors;
	variant?: ColorVariants;
	border?: boolean;
	borderBottom?: boolean;
	type?: string;
	transparent?: boolean;
	defaultValue?: string | number | string[] | undefined;
}

const TextField = ({
	children,
	className,
	color,
	variant,
	value,
	onChange,
	defaultValue,
	border,
	transparent,
	placeholder,
	borderBottom,
	type,
}: PropsWithChildren<TextFieldProps>) => {
	const theme: Theme = useTheme();
	const selectedColor = theme[color || "background"];
	const textColor = selectedColor.text;
	const borderValue = border ? `1px solid ${textColor}` : "none";
	const borderBottomValue =
		borderBottom !== false ? `1px solid ${textColor}` : "none";
	const backgroundColor = transparent
		? selectedColor[variant || "main"] || selectedColor.main
		: "transparent";
	const classes = useStyle(
		textColor,
		backgroundColor,
		borderValue,
		borderBottomValue
	)();

	const [currentValue, setCurrentValue] = useState(defaultValue || "");
	const onInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setCurrentValue(newValue);
		if (onChange) {
			onChange(newValue, e);
		}
	};

	return (
		<input
			placeholder={placeholder}
			value={value || currentValue}
			onChange={onInputEvent}
			type={type || "text"}
			className={`${classes.root} ${className || ""}`}
		>
			{children}
		</input>
	);
};

export default TextField;
