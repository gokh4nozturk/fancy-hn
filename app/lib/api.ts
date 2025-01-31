const API_BASE = "https://hacker-news.firebaseio.com/v0";

export type StoryType = "top" | "best" | "new" | "ask" | "show" | "job";

// Cache for maxItem to avoid frequent API calls
let maxItemCache: { value: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function fetchMaxItem(): Promise<number> {
	// Return cached value if it's still valid
	if (maxItemCache && Date.now() - maxItemCache.timestamp < CACHE_DURATION) {
		return maxItemCache.value;
	}

	try {
		const response = await fetch(`${API_BASE}/maxitem.json`);
		const maxItem = await response.json();

		// Update cache
		maxItemCache = {
			value: maxItem,
			timestamp: Date.now(),
		};

		return maxItem;
	} catch (error) {
		console.error("Error fetching max item:", error);
		// Return cached value if available, even if expired
		return maxItemCache?.value ?? 0;
	}
}

export async function fetchTopStories(limit = 1000): Promise<number[]> {
	const response = await fetch(`${API_BASE}/topstories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchBestStories(limit = 1000): Promise<number[]> {
	const response = await fetch(`${API_BASE}/beststories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchNewStories(limit = 1000): Promise<number[]> {
	const response = await fetch(`${API_BASE}/newstories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchAskStories(limit = 200): Promise<number[]> {
	const response = await fetch(`${API_BASE}/askstories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchShowStories(limit = 200): Promise<number[]> {
	const response = await fetch(`${API_BASE}/showstories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchJobStories(limit = 200): Promise<number[]> {
	const response = await fetch(`${API_BASE}/jobstories.json`);
	const ids = await response.json();
	return ids.slice(0, limit);
}

export async function fetchItem(id: number) {
	const response = await fetch(`${API_BASE}/item/${id}.json`);
	return response.json();
}

export async function fetchUser(username: string) {
	const response = await fetch(`${API_BASE}/user/${username}.json`);
	return response.json();
}

export async function getStories(
	page = 1,
	perPage = 10,
	searchQuery?: string,
	storyType: StoryType = "top",
) {
	let stories: number[];
	const maxItem = await fetchMaxItem();
	const defaultLimit = Math.min(1000, Math.floor(maxItem * 0.01)); // Use 1% of total items as default limit
	const specialLimit = Math.min(200, Math.floor(maxItem * 0.002)); // Use 0.2% for special categories

	switch (storyType) {
		case "best":
			stories = await fetchBestStories(defaultLimit);
			break;
		case "new":
			stories = await fetchNewStories(defaultLimit);
			break;
		case "ask":
			stories = await fetchAskStories(specialLimit);
			break;
		case "show":
			stories = await fetchShowStories(specialLimit);
			break;
		case "job":
			stories = await fetchJobStories(specialLimit);
			break;
		default:
			stories = await fetchTopStories(defaultLimit);
	}

	let filteredStories = stories;

	if (searchQuery) {
		const allStories = await Promise.all(stories.map((id) => fetchItem(id)));
		filteredStories = allStories
			.filter((story) => {
				const searchLower = searchQuery.toLowerCase();
				return (
					story.title?.toLowerCase().includes(searchLower) ||
					story.by?.toLowerCase().includes(searchLower)
				);
			})
			.map((story) => story.id);
	}

	const start = (page - 1) * perPage;
	const end = start + perPage;
	const paginatedStoryIds = filteredStories.slice(start, end);

	const paginatedStories = await Promise.all(
		paginatedStoryIds.map((id) => fetchItem(id)),
	);

	// Filter stories based on type-specific requirements
	const validStories = paginatedStories.filter((story) => {
		if (!story) return false;

		switch (storyType) {
			case "job":
				return story.type === "job";
			case "ask":
				return story.type === "story" && story.title?.startsWith("Ask HN:");
			case "show":
				return story.type === "story" && story.title?.startsWith("Show HN:");
			default:
				return story.url; // For other types, keep the existing URL check
		}
	});

	return {
		stories: validStories,
		total: filteredStories.length,
		currentPage: page,
		totalPages: Math.ceil(filteredStories.length / perPage),
		storyType,
	};
}

export async function summarizeStory(url: string) {
	try {
		const response = await fetch("/api/summarize", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		});

		if (!response.ok) {
			throw new Error("Failed to summarize story");
		}

		return response.json();
	} catch (error) {
		console.error("Error summarizing story:", error);
		return {
			error:
				"Özet oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
		};
	}
}
