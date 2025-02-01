import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const OPENAI_KEY_STORAGE = "fancy-hn-openai-key";

export function getStoredApiKey(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(OPENAI_KEY_STORAGE);
}

export function setStoredApiKey(key: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(OPENAI_KEY_STORAGE, key);
}

export function removeStoredApiKey(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(OPENAI_KEY_STORAGE);
}

export function formatMarkdown(text: string): string {
	// Replace **text** with <strong>text</strong>
	let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Replace *text* with <em>text</em>
	formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

	return formattedText;
}
