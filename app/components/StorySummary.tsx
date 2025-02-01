import { FileText } from "lucide-react";
import { formatMarkdown } from "../lib/utils";
import { LoadingText } from "./ui/LoadingText";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface StorySummaryProps {
	storyId: number;
	loading: boolean;
	error?: string | null;
	summary?: string | null;
	className?: string;
	onSummarize?: () => void;
	showSummarizeButton?: boolean;
	showBadgeOnly?: boolean;
}

function SummaryReadyBadge() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-300 ring-1 ring-inset ring-orange-500/20 shrink-0 cursor-help transition-colors hover:bg-orange-100 dark:hover:bg-orange-500/30">
					Summary Ready
				</span>
			</TooltipTrigger>
			<TooltipContent side="bottom" align="start">
				An AI-powered summary has been generated for this story, providing a
				quick overview of its main points and key content.
			</TooltipContent>
		</Tooltip>
	);
}

export function StorySummary({
	storyId,
	loading,
	error,
	summary,
	className = "",
	onSummarize,
	showSummarizeButton = false,
	showBadgeOnly = false,
}: StorySummaryProps) {
	if (showBadgeOnly) {
		return summary ? <SummaryReadyBadge /> : null;
	}

	return (
		<div className={`bg-muted/10 rounded-lg break-words ${className}`}>
			<div className="flex items-center justify-between gap-2 mb-3">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-bold text-foreground m-0">Summary</h3>
					{!loading && summary && <SummaryReadyBadge />}
				</div>
				{showSummarizeButton && onSummarize && !summary && !loading && (
					<button
						type="button"
						onClick={onSummarize}
						className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
					>
						<FileText className="h-4 w-4" />
						Summarize
					</button>
				)}
			</div>
			<div className="text-sm leading-relaxed text-muted-foreground space-y-3">
				{loading ? (
					<LoadingText />
				) : error ? (
					<p className="text-red-500 flex items-center gap-2">{error}</p>
				) : (
					summary?.split("\n\n").map((paragraph) => (
						<p
							key={`summary-${storyId}-${paragraph.slice(0, 32)}`}
							className="text-foreground/90 [&_strong]:font-bold [&_strong]:text-orange-500 dark:[&_strong]:text-orange-300"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown is sanitized
							dangerouslySetInnerHTML={{
								__html: formatMarkdown(paragraph),
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}
