import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";

//from https://stackoverflow.com/a/34749873

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep<T extends Record<string, unknown>>(
	target: T,
	...sources: PartialPartial<T>[]
): T {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		const objectSource = source as Record<string, unknown>;
		for (const key in objectSource) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(
					target[key] as Record<string, unknown>,
					source[key] as Record<string, unknown>
				);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}
