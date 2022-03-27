import("@web-desktop-environment/app-sdk").then(
	async ({ keepOpen, ServiceManager }) => {
		keepOpen();
		const { RemoteServiceApp } = await import("./App");
		ServiceManager.renderService(RemoteServiceApp, "service-example");
	}
);
