import { getStories } from './lib/api';
import StoryList from './components/StoryList';
import { ThemeToggle } from './components/ThemeToggle'
import Pagination from './components/Pagination'
import { SearchBar } from './components/SearchBar'
import { GithubIcon } from 'lucide-react'
import { RefreshButton } from './components/RefreshButton'
import { Button } from './components/ui/button'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
 
export async function generateMetadata(props: {
  params: Params
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1;

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
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const { stories, total, currentPage, totalPages } = await getStories(page, 10, searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Hacker News" className="w-6 h-6" />
            <h1 className="sm:text-xl font-bold text-orange-500">Hacker News</h1>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <RefreshButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className='flex flex-col sm:flex-row gap-2 justify-between items-center mb-8'>
          <h1 className="text-2xl font-bold">
            {searchQuery ? `Search: ${searchQuery}` : 'Hacker News'}
          </h1>
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
      <footer className="bg-card border-t sticky bottom-0 max-sm:pb-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
          <p className=" text-muted-foreground">
            &copy; {new Date().getFullYear()} Hacker News. All rights reserved.
          </p>
          <p className="text-orange-500 flex items-center gap-1">
            <GithubIcon className="w-4 h-4" /> created by {' '}
            <a href="https://github.com/gokh4nozturk" className='hover:underline max-sm:underline' target="_blank" rel="noopener noreferrer">
              gokh4nozturk
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
