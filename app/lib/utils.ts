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
	// Only handle double asterisks for bold text
	return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
