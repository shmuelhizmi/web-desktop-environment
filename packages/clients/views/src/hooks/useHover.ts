import React from "react";

export function useHover(): {
	isHovered: boolean;
	bind: { onMouseEnter: () => void; onMouseLeave: () => void };
} {
	const [isHovered, setIsHovered] = React.useState(false);

	const bind = React.useMemo(() => {
		return {
			onMouseEnter: () => setIsHovered(true),
			onMouseLeave: () => setIsHovered(false),
		};
	}, []);

	return { isHovered, bind };
}
