"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
	ExternalLink,
	FileText,
	MessageSquare,
	ThumbsUp,
	User as UserIcon,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useStorySummaries } from "../hooks/useStorySummaries";
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
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
		/>
	);
}

const LoadingText = () => {
	const [text, setText] = useState("Generating summary");

	useEffect(() => {
		const dots = [".", "..", "..."];
		let i = 0;

		const interval = setInterval(() => {
			setText(`Generating summary${dots[i]}`);
			i = (i + 1) % dots.length;
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return <span className="inline-block min-w-[180px] font-mono">{text}</span>;
};

export default function StoryDetail({ story, onClose, open }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [author, setAuthor] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);
	const [hasInitialized, setHasInitialized] = useState(false);
	const { getSummary, getSummaryState } = useStorySummaries();

	const handleSummarize = useCallback(async () => {
		if (!story.url) return;
		await getSummary(story.id, story.url);
	}, [story.url, story.id, getSummary]);

	// Initialize data when dialog opens
	useEffect(() => {
		if (!open || hasInitialized) return;

		const initializeData = async () => {
			setLoading(true);
			try {
				// Fetch comments if available
				if (story.kids?.length) {
					const fetchedComments = await Promise.all(
						story.kids.slice(0, 10).map((id) => fetchItem(id)),
					);
					setComments(
						fetchedComments.filter(
							(c): c is Comment =>
								c?.type === "comment" && !c.deleted && !c.dead,
						),
					);
				}

				// Fetch author details
				if (story.by) {
					const authorData = await fetchUser(story.by);
					setAuthor(authorData);
				}

				setHasInitialized(true);
			} catch (error) {
				console.error("Error initializing data:", error);
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, [open, story, hasInitialized]);

	// Reset initialization state when dialog closes
	useEffect(() => {
		if (!open) {
			setHasInitialized(false);
		}
	}, [open]);

	const summaryState = getSummaryState(story.id);

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
						<div className="p-4 sm:p-6 border-b bg-background">
							<div className="space-y-4">
								<div className="flex items-start justify-between gap-4">
									<Dialog.Title className="text-lg sm:text-xl font-bold leading-tight text-foreground">
										{story.title}
									</Dialog.Title>
									<Dialog.Close
										className="p-2 hover:bg-muted rounded-full shrink-0"
										aria-label="Close dialog"
									>
										<X className="h-4 w-4" />
									</Dialog.Close>
								</div>

								{story.url && (
									<div className="flex items-center justify-between">
										<a
											href={story.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-sm text-orange-500 hover:underline"
										>
											<ExternalLink className="h-4 w-4" />
											{new URL(story.url).hostname}
										</a>
										<button
											type="button"
											onClick={handleSummarize}
											disabled={summaryState.loading || !!summaryState.summary}
											className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<FileText className="h-4 w-4" />
											{summaryState.loading
												? "Summarizing..."
												: summaryState.summary
													? "Summary Ready"
													: "Summarize"}
										</button>
									</div>
								)}

								<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
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
						<div className="flex-1 overflow-y-auto bg-background">
							<div className="p-4 sm:p-6 space-y-6">
								{/* Summary */}
								{story.url && (
									<div className="prose prose-orange dark:prose-invert max-w-none bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 break-words overflow-hidden border border-orange-200 dark:border-orange-900">
										<h3 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
											Summary
										</h3>
										<p className="text-sm text-orange-700 dark:text-orange-300">
											{summaryState.loading ? (
												<LoadingText />
											) : summaryState.error ? (
												summaryState.error
											) : (
												summaryState.summary ||
												"Click 'Summarize' to generate a summary"
											)}
										</p>
									</div>
								)}

								{/* Story Content */}
								{story.text && (
									<SanitizedHtml
										html={story.text}
										className="prose prose-orange dark:prose-invert max-w-none bg-muted/50 rounded-lg p-4 break-words overflow-hidden"
									/>
								)}

								{/* Author Info */}
								{author && (
									<div className="rounded-lg bg-muted p-4">
										<h3 className="font-medium mb-2 flex items-center gap-2 text-foreground">
											<UserIcon className="h-4 w-4" />
											About {author.id}
										</h3>
										<div className="space-y-1 text-sm text-muted-foreground">
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
													className="prose prose-sm dark:prose-invert max-w-none mt-2 text-muted-foreground break-words overflow-hidden"
												/>
											)}
										</div>
									</div>
								)}

								{/* Comments */}
								<div className="space-y-4">
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
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
