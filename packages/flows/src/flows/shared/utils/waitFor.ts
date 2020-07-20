export default (toCheck: () => boolean, everyXSec: number): Promise<void> => {
	return new Promise((resolve) => {
		const check = () => {
			if (toCheck()) {
				resolve();
			} else {
				setTimeout(check, everyXSec);
			}
		};
		check();
	});
};
