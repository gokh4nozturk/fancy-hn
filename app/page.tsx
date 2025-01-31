import { getStories } from './lib/api';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';

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
      <Header />
      <MainContent 
        stories={stories}
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={searchQuery}
      />
      <Footer />
    </div>
  );
}
