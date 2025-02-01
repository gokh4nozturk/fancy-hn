import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { MessageSquare, User as UserIcon } from "lucide-react";
import type { Comment } from "../types";
import { SanitizedHtml } from "./ui/SanitizedHtml";

interface CommentsProps {
	comments: Comment[];
	loading?: boolean;
	className?: string;
}

export function Comments({
	comments,
	loading = false,
	className = "",
}: CommentsProps) {
	return (
		<div className={`space-y-4 ${className}`}>
			<h3 className="font-medium flex items-center gap-2 text-foreground">
				<MessageSquare className="h-4 w-4" />
				Comments ({comments.length})
			</h3>
			{loading ? (
				<div className="text-center py-8 text-muted-foreground">
					Loading comments...
				</div>
			) : comments.length > 0 ? (
				<div className="space-y-3">
					{comments.map((comment) => (
						<motion.div
							key={comment.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="rounded-lg bg-muted/50 p-4 border border-border"
						>
							<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
								<UserIcon className="h-3 w-3" />
								<span className="font-medium">{comment.by}</span>
								<span>•</span>
								<span>
									{formatDistanceToNow(comment.time * 1000, {
										locale: enUS,
									})}{" "}
									ago
								</span>
							</div>
							<SanitizedHtml
								html={comment.text}
								className="prose prose-sm dark:prose-invert max-w-none text-foreground break-words overflow-hidden overflow-x-auto"
							/>
						</motion.div>
					))}
				</div>
			) : (
				<div className="text-center py-8 text-muted-foreground">
					No comments yet
				</div>
			)}
		</div>
	);
}
