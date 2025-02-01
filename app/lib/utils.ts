import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatMarkdown(text: string): string {
	// Only handle double asterisks for bold text
	return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
