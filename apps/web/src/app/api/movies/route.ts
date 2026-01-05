import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const title =
		request.nextUrl.searchParams.get("title") ||
		request.nextUrl.searchParams.get("q");
	const apiKey = process.env.OMDBAPI_KEY;
	const region = request.nextUrl.searchParams.get("r") || "short"; // short/full plot toggle if ever needed

	if (!title || !title.trim()) {
		return NextResponse.json(
			{ error: "Query parameter 'title' (or 'q') is required" },
			{ status: 400 },
		);
	}

	if (!apiKey) {
		return NextResponse.json(
			{ error: "OMDBAPI_KEY is not configured on the server" },
			{ status: 500 },
		);
	}

	const encoded = encodeURIComponent(title.trim());
	const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encoded}&plot=${region}`;

	try {
		const res = await fetch(url, { cache: "no-store" });
		if (!res.ok) {
			return NextResponse.json(
				{ error: `Upstream error: ${res.status}` },
				{ status: 502 },
			);
		}
		const data = await res.json();

		if (data?.Response === "False") {
			return NextResponse.json(
				{ error: data?.Error || "Movie not found", raw: data },
				{ status: 404 },
			);
		}

		const payload = {
			title: data?.Title ?? null,
			year: data?.Year ?? null,
			poster: data?.Poster ?? null,
			imdbId: data?.imdbID ?? null,
			raw: data,
		};

		return NextResponse.json(payload);
	} catch (error) {
		console.error("GET /api/movies error", error);
		return NextResponse.json(
			{ error: "Failed to fetch movie data", detail: String(error) },
			{ status: 500 },
		);
	}
}
