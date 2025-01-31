"use client";

import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { useReadStories } from "../hooks/useReadStories";
import type { Story } from "../types";
import StoryDialog from "./StoryDialog";

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
		<div className="divide-y divide-orange-100">
			{stories.map((story, index) => (
				<motion.article
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
					key={story.id}
					className={`py-4 transition-colors ${
						isRead(story.id) ? "bg-orange-50/50" : "hover:bg-orange-50/30"
					}`}
				>
					<div className="flex items-start gap-2">
						<div className="flex gap-2">
							<StoryDialog story={story} onStorySelect={setSelectedStory} />
						</div>

						<div className="flex-1 space-y-1">
							<h2>
								<a
									href={story.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`text-lg font-medium transition-colors hover:underline max-sm:text-sm ${
										isRead(story.id)
											? "text-gray-600 hover:text-gray-800"
											: "hover:text-orange-500 max-sm:text-orange-500"
									}`}
									onClick={() => handleStoryClick(story)}
								>
									{story.title}
								</a>
								{story.url && (
									<span className="ml-2 text-sm text-muted-foreground">
										({new URL(story.url).hostname})
									</span>
								)}
							</h2>

							<div className="text-sm text-muted-foreground">
								<span>{story.score} points</span>
								<span className="mx-1">•</span>
								<span>by {story.by}</span>
								<span className="mx-1">•</span>
								<span>
									{formatDistanceToNow(story.time * 1000, { locale: enUS })} ago
								</span>
								<span className="mx-1">•</span>
								<span>{story.descendants} comments</span>
							</div>
						</div>
					</div>
				</motion.article>
			))}
		</div>
	);
}
