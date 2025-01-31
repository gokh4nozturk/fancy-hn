export function getApiUrl() {
	if (typeof window === "undefined") {
		return process.env.NEXT_PUBLIC_API_URL;
	}

	// In the browser, use the current origin
	return window.location.origin;
}
