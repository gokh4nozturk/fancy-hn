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
		const { url } = await request.json();

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		console.log("Fetching URL:", url);
		// Fetch the content from the URL with timeout
		const response = await fetch(url, {
			signal: AbortSignal.timeout(5000), // 5 second timeout
		});

		if (!response.ok) {
			throw new Error("Failed to fetch URL content");
		}

		const html = await response.text();

		// Extract text content from HTML (basic implementation)
		const textContent = html
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 2000);

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
		return NextResponse.json({ summary });
	} catch (error: unknown) {
		console.error("Summary generation error:", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "An error occurred while generating the summary";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
