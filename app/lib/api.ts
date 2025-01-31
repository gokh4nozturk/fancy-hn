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

export async function getStories(page = 1, perPage = 10, searchQuery?: string) {
  const stories = await fetchTopStories();
  let filteredStories = stories;

  if (searchQuery) {
    const allStories = await Promise.all(stories.map(id => fetchItem(id)));
    filteredStories = allStories
      .filter(story => {
        const searchLower = searchQuery.toLowerCase();
        return (
          story.title?.toLowerCase().includes(searchLower) ||
          story.by?.toLowerCase().includes(searchLower)
        );
      })
      .map(story => story.id);
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedStoryIds = filteredStories.slice(start, end);

  const paginatedStories = await Promise.all(
    paginatedStoryIds.map(id => fetchItem(id))
  );

  const validStories = paginatedStories.filter(story => story?.url);

  return {
    stories: validStories,
    total: filteredStories.length,
    currentPage: page,
    totalPages: Math.ceil(filteredStories.length / perPage)
  };
}

export async function summarizeStory(url: string, apiKey: string) {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to summarize story');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error summarizing story:', error);
    return { summary: 'Failed to generate summary.' };
  }
} 