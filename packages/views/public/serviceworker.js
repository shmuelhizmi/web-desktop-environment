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
				return (
					fetch(event.request).then((response) => {
						if (
							event.request.referrer.includes(self.location.origin) &&
							!event.request.url.includes("socket.io")
						) {
							cache.put(event.request, response.clone());
						}
						return response;
					}) || response
				);
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
