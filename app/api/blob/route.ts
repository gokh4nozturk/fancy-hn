import { del, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
	throw new Error("BLOB_READ_WRITE_TOKEN is not defined");
}

const BLOB_PREFIX = "summaries/";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url, `http://${request.headers.get("host")}`);
		const storyId = url.searchParams.get("storyId");

		if (!storyId) {
			return NextResponse.json(
				{ error: "storyId is required" },
				{ status: 400 },
			);
		}

		const { blobs } = await list({
			prefix: `${BLOB_PREFIX}${storyId}.json`,
		});

		const blob = blobs[0];
		if (!blob) {
			return NextResponse.json({ data: null });
		}

		const response = await fetch(blob.url);
		if (!response.ok) {
			throw new Error(`Failed to fetch summary: ${response.statusText}`);
		}

		const data = await response.json();
		return NextResponse.json({ data });
	} catch (error) {
		console.error("Error in GET /api/blob:", error);
		if (error instanceof Error && error.message.includes("Invalid URL")) {
			return NextResponse.json(
				{ error: "Invalid request URL" },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const { storyId, summary } = await request.json();

		if (!storyId || !summary) {
			return NextResponse.json(
				{ error: "storyId and summary are required" },
				{ status: 400 },
			);
		}

		const summaryData = {
			summary,
			timestamp: Date.now(),
		};

		const { url } = await put(
			`${BLOB_PREFIX}${storyId}.json`,
			JSON.stringify(summaryData),
			{
				contentType: "application/json",
				access: "public",
			},
		);

		return NextResponse.json({ data: { ...summaryData, url } });
	} catch (error) {
		console.error("Error saving summary to blob:", error);
		return NextResponse.json(
			{ error: "Failed to save summary" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url, `http://${request.headers.get("host")}`);
		const storyId = url.searchParams.get("storyId");

		if (!storyId) {
			return NextResponse.json(
				{ error: "storyId is required" },
				{ status: 400 },
			);
		}

		await del(`${BLOB_PREFIX}${storyId}.json`);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in DELETE /api/blob:", error);
		if (error instanceof Error && error.message.includes("Invalid URL")) {
			return NextResponse.json(
				{ error: "Invalid request URL" },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}
