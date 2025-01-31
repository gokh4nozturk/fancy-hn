export function getApiUrl() {
	if (typeof window === "undefined") {
		// Server-side: Use Vercel URL in production/preview or localhost in development
		if (process.env.VERCEL_URL) {
			// Check if the URL already includes the protocol
			return process.env.VERCEL_URL.startsWith("http")
				? process.env.VERCEL_URL
				: `https://${process.env.VERCEL_URL}`;
		}
		return "http://localhost:3000";
	}

	// Client-side: Always use the current origin
	return window.location.origin;
}
