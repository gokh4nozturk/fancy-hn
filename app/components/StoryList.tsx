"use client";

import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { ExternalLink, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useReadStories } from "../hooks/useReadStories";
import type { Story } from "../types";
import StoryDetail from "./StoryDetail";

interface Props {
	stories: Story[];
	currentPage: number;
	totalPages: number;
}

export default function StoryList({ stories }: Props) {
	const [selectedStory, setSelectedStory] = useState<Story | null>(null);
	const { isRead, markAsRead } = useReadStories();

	const handleStoryClick = (story: Story) => {
		markAsRead(story.id);
	};

	return (
		<>
			<div className="divide-y divide-border/40">
				{stories.map((story, index) => (
					<motion.article
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						key={story.id}
						className={`py-4 transition-colors ${
							isRead(story.id)
								? "bg-muted/30 dark:bg-muted/10"
								: "hover:bg-muted/20 dark:hover:bg-muted/5"
						}`}
					>
						<div className="flex flex-col gap-2">
							<h2 className="flex flex-col sm:flex-row sm:items-center gap-1">
								<a
									href={story.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`text-lg font-medium transition-colors hover:underline max-sm:text-base ${
										isRead(story.id)
											? "text-muted-foreground/90 hover:text-foreground dark:text-muted-foreground/70 dark:hover:text-foreground"
											: "text-foreground hover:text-orange-500 dark:hover:text-orange-300"
									}`}
									onClick={() => handleStoryClick(story)}
								>
									{story.title}
								</a>
								{story.url && (
									<span className="text-sm text-muted-foreground/80 dark:text-muted-foreground/60 order-first sm:order-none">
										({new URL(story.url).hostname})
									</span>
								)}
							</h2>

							<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground/90 dark:text-muted-foreground/70">
								<span>{story.score} points</span>
								<span className="hidden sm:inline">•</span>
								<span>by {story.by}</span>
								<span className="hidden sm:inline">•</span>
								<span>
									{formatDistanceToNow(story.time * 1000, { locale: enUS })} ago
								</span>
								<span className="hidden sm:inline">•</span>
								<button
									type="button"
									onClick={() => setSelectedStory(story)}
									className="inline-flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-300"
								>
									<MessageSquare className="h-4 w-4" />
									<span>{story.descendants} comments</span>
								</button>
								{story.url && (
									<>
										<span className="hidden sm:inline">•</span>
										<a
											href={story.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 hover:text-orange-500 dark:hover:text-orange-300"
											onClick={() => handleStoryClick(story)}
										>
											<ExternalLink className="h-4 w-4" />
											<span>visit</span>
										</a>
									</>
								)}
							</div>
						</div>
					</motion.article>
				))}
			</div>

			{selectedStory && (
				<StoryDetail
					story={selectedStory}
					open={true}
					onClose={() => setSelectedStory(null)}
				/>
			)}
		</>
	);
}
