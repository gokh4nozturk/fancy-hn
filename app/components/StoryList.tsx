"use client";

import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { useReadStories } from "../hooks/useReadStories";
import { useStorySummaries } from "../hooks/useStorySummaries";
import type { Story } from "../types";
import StoryDetail from "./StoryDetail";
import { StoryMetadata } from "./StoryMetadata";
import { StorySummary } from "./StorySummary";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
	stories: Story[];
	currentPage: number;
	totalPages: number;
}

export default function StoryList({ stories }: Props) {
	const [selectedStory, setSelectedStory] = useState<Story | null>(null);
	const { isRead, markAsRead } = useReadStories();
	const { getSummary, getSummaryState } = useStorySummaries();

	const handleStoryClick = (story: Story) => {
		markAsRead(story.id);
	};

	const handleSummarize = async (story: Story) => {
		if (!story.url) return;
		await getSummary(story.id, story.url);
	};

	return (
		<>
			<div className="divide-y divide-border/40">
				{stories.map((story, index) => {
					const summaryState = getSummaryState(story.id);

					return (
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

								<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
									<StoryMetadata
										story={story}
										onCommentClick={() => setSelectedStory(story)}
									/>
									{story.url && (
										<Popover.Root
											onOpenChange={(open) => {
												if (
													open &&
													!summaryState.summary &&
													!summaryState.loading
												) {
													handleSummarize(story);
												}
											}}
										>
											<Popover.Trigger asChild>
												<button
													type="button"
													className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-orange-500 dark:hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
													disabled={summaryState.loading}
												>
													{summaryState.loading
														? "summarizing..."
														: summaryState.summary
															? "summary"
															: "summarize"}
												</button>
											</Popover.Trigger>
											<Popover.Portal>
												<Popover.Content
													className="w-[400px] rounded-lg bg-card p-4 shadow-lg border border-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
													side="top"
													align="start"
													sideOffset={8}
												>
													<StorySummary
														storyId={story.id}
														loading={summaryState.loading}
														error={summaryState.error}
														summary={summaryState.summary}
													/>
													<Popover.Arrow className="fill-card" />
													<Popover.Close className="absolute top-4 right-3 rounded-full p-2 opacity-70 hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
														<X className="h-4 w-4" />
														<span className="sr-only">Close</span>
													</Popover.Close>
												</Popover.Content>
											</Popover.Portal>
										</Popover.Root>
									)}
								</div>
							</div>
						</motion.article>
					);
				})}
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
