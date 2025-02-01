import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { MessageSquare, ThumbsUp, User as UserIcon } from "lucide-react";
import type { Story } from "../types";

interface StoryMetadataProps {
	story: Story;
	className?: string;
	showComments?: boolean;
	onCommentClick?: () => void;
}

export function StoryMetadata({
	story,
	className = "",
	showComments = true,
	onCommentClick,
}: StoryMetadataProps) {
	return (
		<div
			className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground ${className}`}
		>
			<div className="flex items-center gap-1">
				<ThumbsUp className="h-4 w-4" />
				<span>{story.score} points</span>
			</div>
			<div className="flex items-center gap-1">
				<UserIcon className="h-4 w-4" />
				<span>by {story.by}</span>
			</div>
			{showComments && (
				<div className="flex items-center gap-1">
					<MessageSquare className="h-4 w-4" />
					{onCommentClick ? (
						<button
							type="button"
							onClick={onCommentClick}
							className="hover:text-orange-500 dark:hover:text-orange-300"
						>
							{story.descendants} comments
						</button>
					) : (
						<span>{story.descendants} comments</span>
					)}
				</div>
			)}
			<span>
				{formatDistanceToNow(story.time * 1000, { locale: enUS })} ago
			</span>
		</div>
	);
}
