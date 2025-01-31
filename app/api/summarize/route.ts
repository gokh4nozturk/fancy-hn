import { getSummaryFromBlob, saveSummaryToBlob } from "@/app/lib/storage/blob";
import { NextResponse } from "next/server";
import Together from "together-ai";

if (!process.env.TOGETHER_API_KEY) {
	throw new Error("TOGETHER_API_KEY environment variable is not defined");
}

const together = new Together({
	apiKey: process.env.TOGETHER_API_KEY,
});

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
		if (existingSummary) {
			console.log("Using cached summary from Blob storage");
			return NextResponse.json({ summary: existingSummary.summary });
		}

		console.log("Fetching URL:", url);
		// Fetch the content from the URL with timeout
		const response = await fetch(url, {
			signal: AbortSignal.timeout(15000), // 15 second timeout
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; FancyHN/1.0; +http://localhost:3000)",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch URL content: ${response.status} ${response.statusText}`,
			);
		}

		const html = await response.text();

		// Extract text content from HTML (improved implementation)
		const textContent = html
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
			.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
			.replace(/<[^>]*>/g, " ") // Remove HTML tags
			.replace(/\s+/g, " ") // Normalize whitespace
			.replace(/&[a-z]+;/gi, " ") // Remove HTML entities
			.trim()
			.slice(0, 4000); // Take more content for better context

		if (!textContent) {
			throw new Error("No content could be extracted from the URL");
		}

		// Use Together AI SDK for summarization
		const completion = await together.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that summarizes text content concisely and accurately.",
				},
				{
					role: "user",
					content: `Please summarize the following text:\n\n${textContent}`,
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
