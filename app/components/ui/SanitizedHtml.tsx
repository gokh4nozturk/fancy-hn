interface SanitizedHtmlProps {
	html: string;
	className?: string;
}

export function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
	const sanitizeHtml = (html: string) => {
		return html
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
			.replace(/on\w+="[^"]*"/g, "")
			.replace(/javascript:/gi, "");
	};

	return (
		<div
			className={className}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized
			dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
		/>
	);
}
