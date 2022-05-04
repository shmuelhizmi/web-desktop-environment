export const getGlobal = <T>(get: () => T, location: string): T => {
	if (!window.__WDE_GLOBAL_STORE__) {
		window.__WDE_GLOBAL_STORE__ = {};
	}
	const value = window.__WDE_GLOBAL_STORE__[location] || get();
	window.__WDE_GLOBAL_STORE__[location] = value;
	return value;
};

declare global {
	interface Window {
		__WDE_GLOBAL_STORE__: {
			[key: string]: any;
		};
	}
}
