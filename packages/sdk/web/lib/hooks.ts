import { useTheme as useThemeBse } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import "@web-desktop-environment/interfaces/lib/web/sdk";

export function useTheme(): Theme {
	return useThemeBse();
}

export function getUrl(domain: string, path = "/", ws = false): string {
	const { host, https, port, token } = window.wdeSdk;
	if (ws) {
		return `${
			https ? "wss" : "ws"
		}://${domain}.${token}.${host}:${port}${path}`;
	}
	return `${
		https ? "https" : "http"
	}://${domain}.${token}.${host}:${port}${path}`;
}
