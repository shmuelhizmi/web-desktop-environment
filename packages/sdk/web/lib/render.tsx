import type { ViewsProvider as VP } from "@react-fullstack/fullstack/server";
import React from "react";
import { getGlobal } from "./global";

export const ClientViewsContext = getGlobal(
	() => React.createContext({} as Record<string, any>),
	"ClientViewsContext"
);

export const ViewsProvider: typeof VP = ClientViewsContext.Consumer as any;

export const ProvideViews = ClientViewsContext.Provider;
