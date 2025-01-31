import { getApiUrl } from "../config";
import type { StorySummary } from "./types";

export async function saveSummaryToBlob(
	storyId: number,
	summary: string,
): Promise<StorySummary> {
	try {
		const apiUrl = getApiUrl();

		const response = await fetch(`${apiUrl}/api/blob`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ storyId, summary }),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.error || "Failed to save summary");
		}

		return responseData.data;
	} catch (error) {
		console.error("Storage error: Failed to save summary", error);
		throw error;
	}
}

export async function getSummaryFromBlob(
	storyId: number,
): Promise<StorySummary | null> {
	try {
		const apiUrl = getApiUrl();
		console.log(
			"Fetching summary from blob storage:",
			`${apiUrl}/api/blob?storyId=${storyId}`,
		);

		const response = await fetch(`${apiUrl}/api/blob?storyId=${storyId}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		const responseData = await response.json();

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(responseData.error || "Failed to fetch summary");
		}

		return responseData.data;
	} catch (error) {
		console.error("Storage error: Failed to fetch summary", error);
		return null;
	}
}

export async function deleteSummaryFromBlob(storyId: number): Promise<void> {
	try {
		const apiUrl = getApiUrl();
		console.log(
			"Deleting summary from blob storage:",
			`${apiUrl}/api/blob?storyId=${storyId}`,
		);

		const response = await fetch(`${apiUrl}/api/blob?storyId=${storyId}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const responseData = await response.json();
			throw new Error(responseData.error || "Failed to delete summary");
		}
	} catch (error) {
		console.error("Storage error: Failed to delete summary", error);
		throw error;
	}
}

export async function listAllSummaries(): Promise<StorySummary[]> {
	try {
		const apiUrl = getApiUrl();
		console.log(
			"Listing all summaries from blob storage:",
			`${apiUrl}/api/blob`,
		);

		const response = await fetch(`${apiUrl}/api/blob`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.error || "Failed to list summaries");
		}

		return responseData.data || [];
	} catch (error) {
		console.error("Storage error: Failed to list summaries", error);
		return [];
	}
}
