import React, { FunctionComponent, useState } from "react";
import { useTheme, makeStyles } from "@material-ui/styles";
import { Theme, Colors, ColorVariants } from "@root/theme";

const useStyle = (
  textColor: string,
  backgroundColor: string,
  border: string,
  borderBottom: string
) =>
  makeStyles((theme: Theme) => ({
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
  value?: any;
  placeholder?: string;
  className?: string;
  color?: Colors;
  variant?: ColorVariants;
  border?: boolean;
  borderBottom?: boolean;
  transparent?: boolean;
  defaultValue?: any;
}

const TextField: FunctionComponent<TextFieldProps> = ({
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
}) => {
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
      className={`${classes.root} ${className || ""}`}
    >
      {children}
    </input>
  );
};

export default TextField;
