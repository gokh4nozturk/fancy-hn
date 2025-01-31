import { useEffect, useState } from "react";
import { SUMMARY_TTL } from "../lib/storage/constants";
import type { StorySummary } from "../lib/storage/types";
import {
	getStorySummaryFromStorage,
	loadStorySummaries,
	removeStorySummary,
	saveStorySummary,
} from "../lib/storage/utils";

export function useStorySummaries() {
	const [summaries, setSummaries] = useState<Record<number, StorySummary>>({});

	useEffect(() => {
		const loadedSummaries = loadStorySummaries();
		setSummaries(loadedSummaries);
	}, []);

	const getSummary = (storyId: number): StorySummary | null => {
		// First check in-memory state
		const inMemorySummary = summaries[storyId];
		if (inMemorySummary) {
			// Validate timestamp
			if (Date.now() - inMemorySummary.timestamp < SUMMARY_TTL) {
				return inMemorySummary;
			}
			// If expired, remove from state and localStorage
			removeStorySummary(storyId);
			setSummaries((prev) => {
				const { [storyId]: _, ...rest } = prev;
				return rest;
			});
			return null;
		}

		// If not in state, check localStorage
		const storageSummary = getStorySummaryFromStorage(storyId);
		if (storageSummary) {
			// Add to state for future use
			setSummaries((prev) => ({
				...prev,
				[storyId]: storageSummary,
			}));
		}
		return storageSummary;
	};

	const storeSummary = (storyId: number, summary: string) => {
		const summaryData = saveStorySummary(storyId, summary);
		setSummaries((prev) => ({
			...prev,
			[storyId]: summaryData,
		}));
	};

	const isSummaryValid = (storyId: number): boolean => {
		const summary = getSummary(storyId);
		return !!summary;
	};

	return {
		getSummary,
		storeSummary,
		isSummaryValid,
	};
}
