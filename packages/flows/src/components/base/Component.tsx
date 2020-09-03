import React from "react";
import { AppProvider } from "@index";

abstract class Component<Props = {}, State = {}> extends React.Component<
	Props,
	State
> {
	static contextType = AppProvider;
	declare context: React.ContextType<typeof AppProvider>;
	protected name = "base_class";
	protected onComponentWillUnmount: (() => void)[] = [];
	abstract renderComponent(): JSX.Element;
	componentWillUnmount() {
		this.onComponentWillUnmount.forEach((cleanUp) => cleanUp());
	}
	public readonly logger = this.context.logger.mount(this.name);
	public readonly desktopManager = this.context.desktopManager;
	render() {
		return (
			<AppProvider.Provider
				value={{
					desktopManager: this.context.desktopManager,
					logger: this.logger,
				}}
			>
				{this.renderComponent()}
			</AppProvider.Provider>
		);
	}
}

export default Component;
