import { fetchTopStories, fetchItem, getStories } from './lib/api';
import StoryList from './components/StoryList';
import type { Story } from './types';
import { ThemeToggle } from './components/ThemeToggle'
import Pagination from './components/Pagination'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
 
export async function generateMetadata(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1;
  const { stories, total, currentPage, totalPages } = await getStories(page);

  return {
    title: `Hacker News - Page ${page}`,
    description: `Page ${page} of Hacker News stories`,
  };
}

export default async function Home(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1;
  const { stories, total, currentPage, totalPages } = await getStories(page);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Hacker News</h1>
            <ThemeToggle />
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className='flex justify-between items-center mb-8'>
          <h1 className="text-2xl font-bold">Hacker News</h1>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
        <StoryList 
          stories={stories}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
