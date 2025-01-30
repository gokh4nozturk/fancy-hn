import { fetchTopStories, fetchItem, getStories } from './lib/api';
import StoryList from './components/StoryList';
import type { Story } from './types';

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { stories, total, currentPage, totalPages } = await getStories(page);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <h1 className="text-xl font-bold text-orange-500">Hacker News</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Hacker News</h1>
        <StoryList 
          stories={stories}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
