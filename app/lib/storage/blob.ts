import type { StorySummary } from "./types";

export async function saveSummaryToBlob(
	storyId: number,
	summary: string,
): Promise<StorySummary> {
	try {
		const response = await fetch("/api/blob", {
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
		console.error("Error saving summary to blob:", error);
		throw error;
	}
}

export async function getSummaryFromBlob(
	storyId: number,
): Promise<StorySummary | null> {
	try {
		const response = await fetch(`/api/blob?storyId=${storyId}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error("Failed to fetch summary");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching summary from blob:", error);
		return null;
	}
}

export async function deleteSummaryFromBlob(storyId: number): Promise<void> {
	try {
		const response = await fetch(`/api/blob?storyId=${storyId}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("Failed to delete summary");
		}
	} catch (error) {
		console.error("Error deleting summary from blob:", error);
		throw error;
	}
}

export async function listAllSummaries(): Promise<StorySummary[]> {
	try {
		const response = await fetch("/api/blob", {
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
		console.error("Error listing summaries:", error);
		return [];
	}
}
