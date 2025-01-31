"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { StoryType } from "../lib/api";
import type { Story } from "../types";
import Pagination from "./Pagination";
import StoryList from "./StoryList";

interface Props {
	stories: Story[];
	currentPage: number;
	totalPages: number;
	searchQuery?: string;
	storyType: StoryType;
}

const storyTypeLabels: Record<StoryType, string> = {
	top: "Top",
	best: "Best",
	new: "New",
	ask: "Ask HN",
	show: "Show HN",
	job: "Jobs",
};

export function MainContent({
	stories,
	currentPage,
	totalPages,
	searchQuery,
	storyType,
}: Props) {
	return (
		<motion.main
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className="max-w-4xl mx-auto py-4 px-4"
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="mb-6"
			>
				<div className="flex flex-col md:flex-row items-center gap-6 border-b border-orange-200 pb-2">
					<nav className="flex items-center gap-4 text-sm">
						{(Object.keys(storyTypeLabels) as StoryType[]).map((type) => (
							<Link
								key={type}
								href={{ query: { type, page: 1 } }}
								className={`transition-colors ${
									storyType === type
										? "text-orange-500 font-medium"
										: "text-foreground hover:text-orange-500"
								}`}
							>
								{storyTypeLabels[type]}
							</Link>
						))}
					</nav>
					<div className="md:ml-auto">
						<Pagination currentPage={currentPage} totalPages={totalPages} />
					</div>
				</div>
				{searchQuery && (
					<div className="mt-4 text-sm text-gray-600">
						Search results for:{" "}
						<span className="font-medium">{searchQuery}</span>
					</div>
				)}
			</motion.div>
			<StoryList
				stories={stories}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</motion.main>
	);
}
