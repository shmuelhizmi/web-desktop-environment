import React from "react";
import { IconBaseProps } from "react-icons";
import { MdError } from "react-icons/all";
import { IconNames } from "@web-desktop-environment/interfaces/lib/shared/icon";
import "./icon.css";

const Icon = (
  props: IconBaseProps & {
    name: IconNames;
    parentClassName?: string;
    parentFill?: boolean;
  }
) => {
  return (
    <span className={`icon-parent ${props.parentClassName || ""}`}>
      {React.createElement(
        require(`react-icons/all`)[props.name] || MdError,
        props
      )}
    </span>
  );
};
export default Icon;
