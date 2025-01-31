import { getSummaryFromBlob, saveSummaryToBlob } from "@/app/lib/storage/blob";
import { NextResponse } from "next/server";
import Together from "together-ai";

if (!process.env.TOGETHER_API_KEY) {
	throw new Error("TOGETHER_API_KEY environment variable is not defined");
}

const together = new Together({
	apiKey: process.env.TOGETHER_API_KEY,
});

class FetchError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly url?: string,
	) {
		super(message);
		this.name = "FetchError";
	}
}

async function fetchWithFallback(url: string, retries = 3): Promise<string> {
	const userAgents = [
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (compatible; FancyHN/1.0; +http://localhost:3000)",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	];

	const errors: Error[] = [];

	for (const userAgent of userAgents) {
		let attemptsLeft = retries;

		while (attemptsLeft > 0) {
			try {
				const response = await fetch(url, {
					signal: AbortSignal.timeout(10000),
					headers: {
						"User-Agent": userAgent,
						Accept:
							"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
						"Accept-Language": "en-US,en;q=0.5",
						"Accept-Encoding": "gzip, deflate, br",
						DNT: "1",
						Connection: "keep-alive",
						"Upgrade-Insecure-Requests": "1",
						"Sec-Fetch-Dest": "document",
						"Sec-Fetch-Mode": "navigate",
						"Sec-Fetch-Site": "none",
						"Sec-Fetch-User": "?1",
						"Cache-Control": "no-cache",
					},
				});

				if (!response.ok) {
					throw new FetchError(
						`HTTP error! status: ${response.status}`,
						response.status,
						url,
					);
				}

				const text = await response.text();
				if (!text) {
					throw new FetchError(
						"Empty response from server",
						response.status,
						url,
					);
				}

				return text;
			} catch (error) {
				attemptsLeft--;
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";
				console.warn(
					`Failed to fetch with user agent ${userAgent} (${attemptsLeft} attempts left):`,
					errorMessage,
				);
				errors.push(error as Error);

				if (attemptsLeft === 0) break;
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
			}
		}
	}

	const errorMessages = errors.map((e) => e.message).join(", ");
	throw new FetchError(
		`All fetch attempts failed: ${errorMessages}`,
		undefined,
		url,
	);
}

export async function POST(request: Request) {
	try {
		const { url, storyId } = await request.json();

		if (!url || !storyId) {
			return NextResponse.json(
				{ error: "URL and storyId are required" },
				{ status: 400 },
			);
		}

		// First check if we already have a summary
		const existingSummary = await getSummaryFromBlob(storyId);

		if (existingSummary?.summary) {
			return NextResponse.json({ summary: existingSummary.summary });
		}

		let html: string;
		try {
			html = await fetchWithFallback(url);
		} catch (error) {
			console.error("Failed to fetch URL:", error);

			if (error instanceof FetchError) {
				const status = error.status || 503;
				let message = "Could not access the article. ";

				if (status === 403 || status === 401) {
					message += "The website is blocking access. ";
				} else if (status === 404) {
					message += "The article could not be found. ";
				} else if (status === 429) {
					message += "Too many requests to the website. ";
				} else if (status >= 500) {
					message += "The website is experiencing issues. ";
				} else {
					message +=
						"The website might be blocking access or taking too long to respond. ";
				}

				message += "Please try again later.";

				return NextResponse.json({ error: message }, { status });
			}

			return NextResponse.json(
				{
					error: "Could not access the article. Please try again later.",
				},
				{ status: 503 },
			);
		}

		// Extract text content from HTML (improved implementation)
		const textContent = html
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
			.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
			.replace(/<nav\b[^>]*>.*?<\/nav>/gi, "") // Remove navigation
			.replace(/<header\b[^>]*>.*?<\/header>/gi, "") // Remove header
			.replace(/<footer\b[^>]*>.*?<\/footer>/gi, "") // Remove footer
			.replace(/<[^>]*>/g, " ") // Remove remaining HTML tags
			.replace(/\s+/g, " ") // Normalize whitespace
			.replace(/&[a-z]+;/gi, " ") // Remove HTML entities
			.trim()
			.slice(0, 4000); // Take more content for better context

		if (!textContent || textContent.length < 100) {
			return NextResponse.json(
				{
					error: "Could not extract enough readable content from the article.",
				},
				{ status: 422 },
			);
		}

		// Use Together AI SDK for summarization
		const completion = await together.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that summarizes text content concisely and accurately. Focus on the main points and key takeaways.",
				},
				{
					role: "user",
					content: `Please provide a clear and concise summary of the following text, highlighting the key points:\n\n${textContent}`,
				},
			],
			model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
			max_tokens: 200,
			temperature: 0.3,
			top_p: 0.7,
		});

		const summary =
			completion.choices[0]?.message?.content?.trim() ||
			"Failed to generate summary";

		// Save the summary to Blob storage
		await saveSummaryToBlob(storyId, summary);

		return NextResponse.json({ summary });
	} catch (error: unknown) {
		console.error("Summary generation error:", error);
		let errorMessage = "An error occurred while generating the summary";

		if (error instanceof Error) {
			if (error.message.includes("Failed to fetch")) {
				errorMessage =
					"Could not access the article. The website might be blocking access or taking too long to respond.";
			} else if (error.message.includes("No content")) {
				errorMessage = "Could not extract readable content from the article.";
			} else {
				errorMessage = error.message;
			}
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
