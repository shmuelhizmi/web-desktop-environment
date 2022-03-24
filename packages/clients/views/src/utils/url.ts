import { reactFullstackConnectionManager } from "..";

export function url({
	ws = false,
	path = "/",
	domain = "desktop",
	port = reactFullstackConnectionManager.mainPort,
	host = reactFullstackConnectionManager.host,
}) {
	let protocol = ws ? "ws" : "http";
	if (reactFullstackConnectionManager.https) {
		protocol += "s";
	}
	return `${protocol}://${domain}.${reactFullstackConnectionManager.token}.${host}:${port}${path}`;
}
