const API_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStories(limit = 1000): Promise<number[]> {
  const response = await fetch(`${API_BASE}/topstories.json`);
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

export async function getStories(page = 1, perPage = 10) {
  const stories = await fetchTopStories();
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedStoryIds = stories.slice(start, end);

  const paginatedStories = await Promise.all(
    paginatedStoryIds.map(id => fetchItem(id))
  );

  return {
    stories: paginatedStories,
    total: stories.length,
    currentPage: page,
    totalPages: Math.ceil(stories.length / perPage)
  };
} 