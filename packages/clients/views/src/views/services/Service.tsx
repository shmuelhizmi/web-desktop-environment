import React from "react";
import ServiceView from "@web-desktop-environment/interfaces/lib/views/desktop/service";
import { asFullStackView } from "@utils/functionComponent";
import { TopBarItem } from "@root/hooks/TopBarItem";

export default asFullStackView<ServiceView>((props) => {
	// const { buttons, icon, onAction, text } = props;
    return (
        <TopBarItem>
            test
        </TopBarItem>
    );
});
