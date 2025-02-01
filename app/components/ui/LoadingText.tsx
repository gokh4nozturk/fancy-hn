import { useEffect, useState } from "react";

interface LoadingTextProps {
	text?: string;
	className?: string;
}

export function LoadingText({
	text = "Generating summary",
	className,
}: LoadingTextProps) {
	const [displayText, setDisplayText] = useState(text);

	useEffect(() => {
		const dots = [".", "..", "..."];
		let i = 0;

		const interval = setInterval(() => {
			setDisplayText(`${text}${dots[i]}`);
			i = (i + 1) % dots.length;
		}, 500);

		return () => clearInterval(interval);
	}, [text]);

	return (
		<span className={`inline-block min-w-[180px] font-mono ${className}`}>
			{displayText}
		</span>
	);
}
