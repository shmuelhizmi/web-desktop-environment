import React, { PropsWithChildren, useState } from "react";

const MountUnmoutAnmiation = (
	props: PropsWithChildren<{ className: string; mount: boolean }>
) => {
	const [mount, setMount] = useState(props.mount);
	return mount || props.mount ? (
		<div
			className={props.className}
			onAnimationEnd={() => {
				setMount(props.mount);
			}}
		>
			{props.children}
		</div>
	) : null;
};

export default MountUnmoutAnmiation;
