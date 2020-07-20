import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import Emiiter from "@utils/emitter";
import { defaultFlowInput } from "@managers/desktopManager";

export type CancelEmitterEvent = {
	cancel: void;
};

type CancelEmitter = Emiiter<CancelEmitterEvent>;

export default <
	Flow<
		ViewInterfacesType,
		{
			childFlow: Flow<
				ViewInterfacesType,
				Record<string, unknown> & defaultFlowInput
			>;
			childInput?: Record<string, unknown> & defaultFlowInput;
			cancelEmitter: CancelEmitter;
		} & defaultFlowInput
	>
>(async ({
	view,
	views,
	input: { childFlow, childInput, desktopManager, parentLogger },
	flow,
	onCanceled,
}) => {
	const theme = view(0, views.themeProvider, {
		theme: desktopManager.settingsManager.settings.desktop.theme,
	});
	desktopManager.settingsManager.emitter.on("onNewSettings", (settings) =>
		theme.update({ theme: settings.desktop.theme })
	);
	const app = flow(
		childFlow,
		{ ...(childInput || {}), desktopManager, parentLogger },
		theme
	);
	onCanceled(() => {
		app.cancel();
	});
	await theme;
});
