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
			className="max-w-4xl mx-auto py-8 px-4"
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-8"
			>
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<h1 className="text-2xl font-bold">
						{searchQuery ? `Search: ${searchQuery}` : "Hacker News"}
					</h1>
					<div className="flex flex-wrap items-center gap-2 text-sm">
						{(Object.keys(storyTypeLabels) as StoryType[]).map((type) => (
							<Link
								key={type}
								href={{ query: { type, page: 1 } }}
								className={`px-3 py-1 rounded-full transition-colors ${
									storyType === type
										? "bg-orange-500 text-white"
										: "hover:bg-orange-100"
								}`}
							>
								{storyTypeLabels[type]}
							</Link>
						))}
					</div>
				</div>
				<Pagination currentPage={currentPage} totalPages={totalPages} />
			</motion.div>
			<StoryList
				stories={stories}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</motion.main>
	);
}
