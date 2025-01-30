import { fetchTopStories, fetchItem } from './lib/api';
import StoryList from './components/StoryList';
import type { Story } from './types';

export default async function Home() {
  const storyIds = await fetchTopStories();
  const stories = await Promise.all(
    storyIds.map(id => fetchItem(id))
  );

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hacker News</h1>
      <StoryList stories={stories} />
    </main>
  );
}
