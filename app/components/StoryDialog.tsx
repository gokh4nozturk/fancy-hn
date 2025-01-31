"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { AlertTriangle, Bot, Loader2, X } from "lucide-react";
import { useState } from "react";
import { summarizeStory } from "../lib/api";
import type { Story } from "../types";

interface Props {
	story: Story | null;
	onStorySelect: (story: Story) => void;
}

export default function StoryDialog({ story, onStorySelect }: Props) {
	const [summary, setSummary] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSummarize = async () => {
		if (!story?.url) return;

		setIsLoading(true);
		setError(null);
		try {
			const result = await summarizeStory(story.url);
			if ("error" in result) {
				setError(result.error);
			} else {
				setSummary(result.summary);
			}
		} catch (error) {
			setError("Failed to generate summary. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button
					disabled
					type="button"
					onClick={() => {
						if (story) {
							onStorySelect(story);
							setSummary(null);
							setError(null);
							handleSummarize();
						}
					}}
					className="p-2 rounded-full hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Bot className="text-orange-500" />
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-50" />
				<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl w-[90vw] max-w-md data-[state=open]:animate-contentShow z-[51]">
					{story && (
						<>
							<Dialog.Title className="text-xl font-bold mb-4">
								AI Summary
							</Dialog.Title>
							<div className="space-y-4">
								{error && (
									<div className="bg-red-50 border border-red-200 p-4 rounded-md">
										<p className="text-sm text-red-800 flex items-center gap-2">
											<AlertTriangle className="h-4 w-4" />
											{error}
										</p>
									</div>
								)}
								{isLoading ? (
									<div className="flex items-center justify-center gap-2 py-8">
										<Loader2 className="h-6 w-6 animate-spin text-orange-500" />
										<p className="text-gray-600">Generating Summary...</p>
									</div>
								) : (
									summary && (
										<div className="p-4 bg-orange-50 rounded-md">
											<p className="text-sm text-gray-700 break-words overflow-hidden">
												{summary}
											</p>
										</div>
									)
								)}
							</div>
							<Dialog.Close asChild>
								<button
									type="button"
									className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
									aria-label="Close"
								>
									<X className="h-4 w-4" />
								</button>
							</Dialog.Close>
						</>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
