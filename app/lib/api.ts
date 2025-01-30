const API_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStories(limit = 30): Promise<number[]> {
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