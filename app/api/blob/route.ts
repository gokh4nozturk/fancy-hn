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

		// List all files in the summaries directory
		const { blobs } = await list({
			prefix: BLOB_PREFIX,
			limit: 100,
		});

		// Find the most recent file for this storyId
		let latestBlob = null;
		let latestTimestamp = 0;

		for (const blob of blobs) {
			try {
				const response = await fetch(blob.url);
				if (!response.ok) continue;

				const data = await response.json();
				if (
					data.storyId === Number(storyId) &&
					data.timestamp > latestTimestamp
				) {
					latestBlob = blob;
					latestTimestamp = data.timestamp;
				}
			} catch (error) {
				// Skip invalid blobs silently
				continue;
			}
		}

		if (!latestBlob) {
			return NextResponse.json({ data: null });
		}

		const response = await fetch(latestBlob.url);
		if (!response.ok) {
			throw new Error(`Failed to fetch summary: ${response.statusText}`);
		}

		const data = await response.json();
		return NextResponse.json({ data });
	} catch (error) {
		console.error("Blob storage error:", error);
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
			storyId: Number(storyId),
			summary,
			timestamp: Date.now(),
		};

		const { url } = await put(
			`${BLOB_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
			JSON.stringify(summaryData),
			{
				contentType: "application/json",
				access: "public",
			},
		);

		return NextResponse.json({ data: summaryData });
	} catch (error) {
		console.error("Failed to save to blob storage:", error);
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
		console.error("Failed to delete from blob storage:", error);
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}
