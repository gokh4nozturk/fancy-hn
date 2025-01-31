export function getApiUrl() {
	if (typeof window === "undefined") {
		// Server-side: Use Vercel URL in production/preview or localhost in development
		return process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000";
	}

	// Client-side: Always use the current origin
	return window.location.origin;
}
