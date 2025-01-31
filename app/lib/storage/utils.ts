import { SUMMARY_KEY_PREFIX, SUMMARY_TTL } from "./constants";
import type { StorySummary } from "./types";

export const loadStorySummaries = (): Record<number, StorySummary> => {
	const loadedSummaries: Record<number, StorySummary> = {};
	const now = Date.now();

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(SUMMARY_KEY_PREFIX)) {
			try {
				const storyId = Number.parseInt(
					key.replace(SUMMARY_KEY_PREFIX, ""),
					10,
				);
				const storedData = localStorage.getItem(key);
				if (storedData) {
					const summary = JSON.parse(storedData) as StorySummary;
					if (now - summary.timestamp < SUMMARY_TTL) {
						loadedSummaries[storyId] = summary;
					} else {
						localStorage.removeItem(key);
					}
				}
			} catch (error) {
				console.error("Error parsing summary:", error);
				if (key) localStorage.removeItem(key);
			}
		}
	}

	return loadedSummaries;
};

export const getStorySummaryFromStorage = (
	storyId: number,
): StorySummary | null => {
	const key = `${SUMMARY_KEY_PREFIX}${storyId}`;
	try {
		const storedData = localStorage.getItem(key);
		if (!storedData) return null;

		const summary = JSON.parse(storedData) as StorySummary;
		if (Date.now() - summary.timestamp >= SUMMARY_TTL) {
			localStorage.removeItem(key);
			return null;
		}

		return summary;
	} catch (error) {
		console.error("Error getting summary:", error);
		localStorage.removeItem(key);
		return null;
	}
};

export const saveStorySummary = (
	storyId: number,
	summary: string,
): StorySummary => {
	const summaryData: StorySummary = {
		summary,
		timestamp: Date.now(),
	};

	const key = `${SUMMARY_KEY_PREFIX}${storyId}`;
	localStorage.setItem(key, JSON.stringify(summaryData));

	return summaryData;
};

export const removeStorySummary = (storyId: number): void => {
	const key = `${SUMMARY_KEY_PREFIX}${storyId}`;
	localStorage.removeItem(key);
};
