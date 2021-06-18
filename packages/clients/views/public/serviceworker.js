/* eslint-disable @typescript-eslint/no-this-alias */

const CACHE_NAME = "version=1";
const urlsToCache = ["index.html"];

// Install SW
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

function parse_url(url) {
	var pattern = RegExp(
		"^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
	);
	var matches = url.match(pattern);
	return {
		scheme: matches[2],
		authority: matches[4],
		path: matches[5],
		query: matches[7],
		fragment: matches[9],
	};
}

const hostToken = {};

self.addEventListener("fetch")

// Listen for requests
self.addEventListener("fetch", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.match(event.request).then((response) => {
				const { authority, path } = parse_url(event.request.url);
				return fetch(event.request, {
					headers: hostToken[authority]
						? { Authorization: "Bearer " + hostToken[authority] }
						: {},
				})
					.then((response) => {
						if (
							event.request.url.includes(self.location.host) &&
							(event.request.destination === "script" ||
								event.request.destination === "document" ||
								event.request.url.endsWith(".html") ||
								event.request.url.endsWith(".css") ||
								event.request.url.endsWith(".js") ||
								event.request.url.endsWith(".json"))
						) {
							cache.put(event.request, response.clone());
						}
						if (path === "/login") {
							return response.json().then(({ success, token }) => {
								if (success) {
									hostToken[authority] = token;
								}
								return response;
							});
						}
						return response;
					})
					.catch(() => response);
			});
		})
	);
});

// Activate the SW
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);

	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});
