import("@web-desktop-environment/app-sdk").then(
	async ({ keepOpen, ServiceManager }) => {
		keepOpen();
		const { RemoteServiceApp } = await import("./App");
		const { views } = await import("../shared/types");
		ServiceManager.renderService(RemoteServiceApp, "service-example", views);
	}
);
