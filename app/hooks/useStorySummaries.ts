import { useState } from "react";

interface SummaryState {
	summary: string;
	loading: boolean;
	error: string | null;
}

export function useStorySummaries() {
	const [summaries, setSummaries] = useState<Record<number, SummaryState>>({});

	const getSummary = async (storyId: number, url: string) => {
		// If already loading, don't make another request
		if (summaries[storyId]?.loading) return;

		// If we already have a summary, return it
		if (summaries[storyId]?.summary) {
			return summaries[storyId].summary;
		}

		// Set loading state
		setSummaries((prev) => ({
			...prev,
			[storyId]: { summary: "", loading: true, error: null },
		}));

		try {
			const response = await fetch("/api/summarize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url, storyId }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to generate summary");
			}

			// Update state with the summary
			setSummaries((prev) => ({
				...prev,
				[storyId]: { summary: data.summary, loading: false, error: null },
			}));

			return data.summary;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to generate summary. Please try again later.";
			console.error("Summary error:", error);
			setSummaries((prev) => ({
				...prev,
				[storyId]: { summary: "", loading: false, error: errorMessage },
			}));
			return null;
		}
	};

	const getSummaryState = (storyId: number): SummaryState => {
		return summaries[storyId] || { summary: "", loading: false, error: null };
	};

	return {
		getSummary,
		getSummaryState,
	};
}
