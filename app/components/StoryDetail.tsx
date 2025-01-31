"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
	ExternalLink,
	MessageSquare,
	ThumbsUp,
	User as UserIcon,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchItem, fetchUser } from "../lib/api";
import type { Comment, Story, User as UserType } from "../types";

interface Props {
	story: Story;
	onClose: () => void;
	open: boolean;
}

function SanitizedHtml({
	html,
	className,
}: { html: string; className?: string }) {
	const sanitizeHtml = (html: string) => {
		return html
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
			.replace(/on\w+="[^"]*"/g, "")
			.replace(/javascript:/gi, "");
	};

	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
		/>
	);
}

export default function StoryDetail({ story, onClose, open }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [author, setAuthor] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (open && story.kids) {
			setLoading(true);
			// Fetch top-level comments
			Promise.all(story.kids.slice(0, 10).map((id) => fetchItem(id)))
				.then((fetchedComments) => {
					setComments(
						fetchedComments.filter(
							(c): c is Comment =>
								c?.type === "comment" && !c.deleted && !c.dead,
						),
					);
				})
				.catch(console.error)
				.finally(() => setLoading(false));

			// Fetch author details
			fetchUser(story.by).then(setAuthor).catch(console.error);
		}
	}, [open, story]);

	return (
		<Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-50" />
				<Dialog.Content
					className="fixed top-[50%] left-[50%] max-h-[90vh] w-[95vw] sm:w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-xl overflow-hidden focus:outline-none z-[51]"
					aria-describedby="story-content"
				>
					<div className="flex flex-col h-full max-h-[90vh]">
						{/* Header - Fixed */}
						<div className="p-4 sm:p-6 border-b bg-white">
							<div className="space-y-4">
								<div className="flex items-start justify-between gap-4">
									<Dialog.Title className="text-lg sm:text-xl font-bold leading-tight">
										{story.title}
									</Dialog.Title>
									<Dialog.Close
										className="p-2 hover:bg-gray-100 rounded-full shrink-0"
										aria-label="Close dialog"
									>
										<X className="h-4 w-4" />
									</Dialog.Close>
								</div>

								{story.url && (
									<a
										href={story.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-sm text-orange-500 hover:underline"
									>
										<ExternalLink className="h-4 w-4" />
										{new URL(story.url).hostname}
									</a>
								)}

								<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 pt-2">
									<div className="flex items-center gap-1">
										<ThumbsUp className="h-4 w-4" />
										<span>{story.score} points</span>
									</div>
									<div className="flex items-center gap-1">
										<UserIcon className="h-4 w-4" />
										<span>by {story.by}</span>
									</div>
									<div className="flex items-center gap-1">
										<MessageSquare className="h-4 w-4" />
										<span>{story.descendants} comments</span>
									</div>
									<span>
										{formatDistanceToNow(story.time * 1000, { locale: enUS })}{" "}
										ago
									</span>
								</div>
							</div>
						</div>

						{/* Scrollable Content */}
						<div className="flex-1 overflow-y-auto">
							<div className="p-4 sm:p-6 space-y-6">
								{/* Story Content */}
								{story.text && (
									<SanitizedHtml
										html={story.text}
										className="prose prose-orange max-w-none bg-orange-50/50 rounded-lg p-4 break-words overflow-hidden"
									/>
								)}

								{/* Author Info */}
								{author && (
									<div className="rounded-lg bg-gray-50 p-4">
										<h3 className="font-medium mb-2 flex items-center gap-2">
											<UserIcon className="h-4 w-4" />
											About {author.id}
										</h3>
										<div className="space-y-1 text-sm text-gray-600">
											<p>Karma: {author.karma}</p>
											<p>
												Member since:{" "}
												{formatDistanceToNow(author.created * 1000, {
													locale: enUS,
													addSuffix: true,
												})}
											</p>
											{author.about && (
												<SanitizedHtml
													html={author.about}
													className="prose prose-sm max-w-none mt-2 text-gray-700 break-words overflow-hidden"
												/>
											)}
										</div>
									</div>
								)}

								{/* Comments */}
								<div className="space-y-4">
									<h3 className="font-medium flex items-center gap-2">
										<MessageSquare className="h-4 w-4" />
										Comments ({comments.length})
									</h3>
									{loading ? (
										<div className="text-center py-8 text-gray-600">
											Loading comments...
										</div>
									) : comments.length > 0 ? (
										<div className="space-y-3">
											{comments.map((comment) => (
												<motion.div
													key={comment.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													className="rounded-lg bg-gray-50/50 p-4 border border-gray-100"
												>
													<div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
														className="prose prose-sm max-w-none text-gray-700 break-words overflow-hidden overflow-x-auto"
													/>
												</motion.div>
											))}
										</div>
									) : (
										<div className="text-center py-8 text-gray-600">
											No comments yet
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
