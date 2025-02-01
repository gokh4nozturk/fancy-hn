import { FileText } from "lucide-react";
import { formatMarkdown } from "../lib/utils";
import { LoadingText } from "./ui/LoadingText";

interface StorySummaryProps {
	storyId: number;
	loading: boolean;
	error?: string | null;
	summary?: string | null;
	className?: string;
	onSummarize?: () => void;
	showSummarizeButton?: boolean;
}

export function StorySummary({
	storyId,
	loading,
	error,
	summary,
	className = "",
	onSummarize,
	showSummarizeButton = false,
}: StorySummaryProps) {
	return (
		<div
			className={`bg-muted/10 rounded-lg p-4 sm:p-6 break-words border ${className}`}
		>
			<div className="flex items-center justify-between gap-2 mb-3">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium text-foreground m-0">Summary</h3>
					{!loading && summary && (
						<span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
							Ready
						</span>
					)}
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
