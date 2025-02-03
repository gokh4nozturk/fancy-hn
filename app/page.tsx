import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { type StoryType, getStories } from "./lib/api";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const storyTypeLabels: Record<StoryType, string> = {
	top: "Top",
	best: "Best",
	new: "New",
	ask: "Ask HN",
	show: "Show HN",
	job: "Jobs",
};

export async function generateMetadata(props: {
	params: Params;
	searchParams: SearchParams;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const storyType = (searchParams.type as StoryType) || "top";
	const label = storyTypeLabels[storyType];

	return {
		title: `${label} Stories - Page ${page}`,
		description: `Page ${page} of ${label.toLowerCase()} Hacker News stories`,
	};
}

export default async function Home(props: {
	params: Params;
	searchParams: SearchParams;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchQuery =
		typeof searchParams.q === "string" ? searchParams.q : undefined;
	const storyType = (searchParams.type as StoryType) || "top";

	const { stories, total, currentPage, totalPages } = await getStories(
		page,
		10,
		searchQuery,
		storyType,
	);

	return (
		<div className="min-h-screen bg-background grid grid-rows-[auto_1fr_auto]">
			<Header />
			<MainContent
				stories={stories}
				currentPage={currentPage}
				totalPages={totalPages}
				searchQuery={searchQuery}
				storyType={storyType}
			/>
			<Footer />
		</div>
	);
}
