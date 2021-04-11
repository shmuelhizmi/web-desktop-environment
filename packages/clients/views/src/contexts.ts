import React from "react";

export const ConnectionContext = React.createContext<
	{ port: number; host: string } | undefined
>(undefined);
