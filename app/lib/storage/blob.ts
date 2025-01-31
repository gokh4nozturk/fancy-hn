import type { StorySummary } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function saveSummaryToBlob(
	storyId: number,
	summary: string,
): Promise<StorySummary> {
	try {
		const response = await fetch(`${API_BASE_URL}/api/blob`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ storyId, summary }),
		});

		if (!response.ok) {
			throw new Error("Failed to save summary");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Storage error: Failed to save summary", error);
		throw error;
	}
}

export async function getSummaryFromBlob(
	storyId: number,
): Promise<StorySummary | null> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/blob?storyId=${storyId}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			},
		);

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error("Failed to fetch summary");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Storage error: Failed to fetch summary", error);
		return null;
	}
}

export async function deleteSummaryFromBlob(storyId: number): Promise<void> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/api/blob?storyId=${storyId}`,
			{
				method: "DELETE",
			},
		);

		if (!response.ok) {
			throw new Error("Failed to delete summary");
		}
	} catch (error) {
		console.error("Storage error: Failed to delete summary", error);
		throw error;
	}
}

export async function listAllSummaries(): Promise<StorySummary[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/api/blob`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to list summaries");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Storage error: Failed to list summaries", error);
		return [];
	}
}
