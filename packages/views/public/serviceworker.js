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

// Listen for requests
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.match(event.request).then((response) => {
				console.log(event.request);
				return fetch(event.request)
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
							console.log(`cache ${event.request.url}`);
							cache.put(event.request, response.clone());
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
