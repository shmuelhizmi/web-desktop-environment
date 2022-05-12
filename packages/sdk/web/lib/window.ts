export const windowBarHeight = isMobile() ? 35 : 25;

export function isMobile() {
	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent
	);
}
