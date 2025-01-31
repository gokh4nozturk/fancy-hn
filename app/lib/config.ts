export function getApiUrl() {
	if (typeof window === "undefined") {
		// Server-side
		if (process.env.VERCEL_ENV === "preview") {
			// For preview deployments
			return `https://${process.env.VERCEL_URL}`;
		}
		// For production and development
		return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	}

	// Client-side: Always use the current origin
	return window.location.origin;
}
