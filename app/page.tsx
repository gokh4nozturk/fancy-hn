import { fetchTopStories, fetchItem } from './lib/api';
import StoryList from './components/StoryList';
import type { Story } from './types';

export default async function Home() {
  const storyIds = await fetchTopStories();
  const stories = await Promise.all(
    storyIds.map(id => fetchItem(id))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <h1 className="text-xl font-bold text-orange-500">Hacker News</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <StoryList stories={stories} />
      </main>
    </div>
  );
}
