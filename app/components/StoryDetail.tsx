"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { ExternalLink, User as UserIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchItem, fetchUser } from "../lib/api";
import type { Comment, Story, User as UserType } from "../types";
import { Comments } from "./Comments";
import { StoryMetadata } from "./StoryMetadata";
import { StorySummary } from "./StorySummary";
import { SanitizedHtml } from "./ui/SanitizedHtml";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
	story: Story;
	onClose: () => void;
	open: boolean;
}

export default function StoryDetail({ story, onClose, open }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [author, setAuthor] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);
	const [hasInitialized, setHasInitialized] = useState(false);
	const [summaryState, setSummaryState] = useState<{
		loading: boolean;
		error: string | null;
		summary: string | null;
	}>({
		loading: false,
		error: null,
		summary: null,
	});

	const handleSummarize = useCallback(async () => {
		if (!story.url) return;
		setSummaryState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await fetch(
				`/api/summarize?id=${story.id}&url=${encodeURIComponent(story.url)}`,
			);
			if (!response.ok) throw new Error("Failed to generate summary");
			const data = await response.json();
			setSummaryState((prev) => ({ ...prev, summary: data.summary }));
		} catch (error) {
			setSummaryState((prev) => ({
				...prev,
				error: "Failed to generate summary. Please try again later.",
			}));
		} finally {
			setSummaryState((prev) => ({ ...prev, loading: false }));
		}
	}, [story.url, story.id]);

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

	return (
		<Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-50" />
				<Dialog.Content
					className="fixed top-[50%] left-[50%] max-h-[90vh] w-[95vw] sm:w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-900 shadow-xl overflow-hidden focus:outline-none z-[51]"
					aria-describedby="story-content"
				>
					<div className="flex flex-col h-full max-h-[90vh]">
						{/* Header - Fixed */}
						<div className="p-4 sm:p-6 border-b bg-background">
							<div className="space-y-4">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 space-y-2">
										<div className="flex flex-wrap items-center gap-2">
											<Dialog.Title className="text-lg sm:text-xl font-bold leading-tight text-foreground">
												{story.title}
											</Dialog.Title>
											{summaryState.summary && (
												<div className="flex items-center gap-2">
													<Tooltip>
														<TooltipTrigger asChild>
															<span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-300 ring-1 ring-inset ring-orange-500/20 shrink-0 cursor-help transition-colors hover:bg-orange-100 dark:hover:bg-orange-500/30">
																Summary Ready
															</span>
														</TooltipTrigger>
														<TooltipContent side="bottom" align="start">
															An AI-powered summary has been generated for this
															story, providing a quick overview of its main
															points and key content.
														</TooltipContent>
													</Tooltip>
												</div>
											)}
										</div>
									</div>
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
									</div>
								)}

								<StoryMetadata story={story} className="pt-2" />
							</div>
						</div>

						{/* Scrollable Content */}
						<div className="flex-1 overflow-y-auto bg-background">
							<div className="p-4 sm:p-6 space-y-6">
								{/* Summary */}
								{story.url && (
									<StorySummary
										storyId={story.id}
										loading={summaryState.loading}
										error={summaryState.error}
										summary={summaryState.summary}
										onSummarize={handleSummarize}
										showSummarizeButton
									/>
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
								<Comments comments={comments} loading={loading} />
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
