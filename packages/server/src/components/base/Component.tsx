import React from "react";
import { AppProvider, WindowContext } from "contexts";
import Logger from "@utils/logger";

abstract class Component<Props = {}, State = {}> extends React.Component<
	Props,
	State
> {
	static contextType = AppProvider;
	declare context: React.ContextType<typeof AppProvider>;
	protected name = "base_class";
	private _logger!: Logger;
	public get logger() {
		if (this._logger) {
			return this._logger;
		} else {
			this._logger = this.context.logger.mount(this.name);
			return this._logger;
		}
	}
	private _windowContext?: React.ContextType<typeof WindowContext>;
	public get windowContext() {
		return this._windowContext;
	}
	public get desktopManager() {
		return this.context.desktopManager;
	}
	public isComponentUnmounted = false;
	protected onComponentWillUnmount: (() => void)[] = [];
	abstract renderComponent(): JSX.Element;
	componentWillUnmount() {
		this.isComponentUnmounted = true;
		this.onComponentWillUnmount.forEach((cleanUp) => cleanUp());
	}
	render() {
		return (
			<AppProvider.Provider
				value={{
					desktopManager: this.context.desktopManager,
					logger: this.logger,
				}}
			>
				{this.renderComponent()}
				<WindowContext.Consumer>
					{(context) => {
						this._windowContext = context;
						return <></>;
					}}
				</WindowContext.Consumer>
			</AppProvider.Provider>
		);
	}
}

export default Component;
