import { db, puzzleSolves, users } from "@/db/client";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
	const puzzleId = Number(params.id);
	if (Number.isNaN(puzzleId)) {
		return NextResponse.json({ error: "Invalid puzzle id" }, { status: 400 });
	}

	try {
		const solves = await db
			.select({
				puzzleId: puzzleSolves.puzzleId,
				userId: puzzleSolves.userId,
				rating: puzzleSolves.rating,
				userName: users.name,
			})
			.from(puzzleSolves)
			.leftJoin(users, eq(users.id, puzzleSolves.userId))
			.where(eq(puzzleSolves.puzzleId, puzzleId));

		return NextResponse.json({ solves });
	} catch (error) {
		console.error(`GET /api/puzzles/${puzzleId}/solves error`, error);
		return NextResponse.json({ error: "Failed to fetch solves" }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
	const puzzleId = Number(params.id);
	if (Number.isNaN(puzzleId)) {
		return NextResponse.json({ error: "Invalid puzzle id" }, { status: 400 });
	}

	try {
		const { userId, rating } = (await request.json()) as {
			userId?: number;
			rating?: number | null;
		};
		if (!userId || Number.isNaN(Number(userId))) {
			return NextResponse.json({ error: "userId is required" }, { status: 400 });
		}

		const normalizedRating = typeof rating === "number" ? Math.round(rating) : null;
		if (normalizedRating !== null && (normalizedRating < 1 || normalizedRating > 5)) {
			return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
		}

		try {
			const inserted = await db
				.insert(puzzleSolves)
				.values({ userId, puzzleId, rating: normalizedRating ?? null })
				.returning();
			return NextResponse.json(inserted[0], { status: 201 });
		} catch (error: unknown) {
			const dbError = error as { code?: string };
			// Unique constraint: user already solved; update rating if provided.
			if (dbError?.code === "23505") {
				if (normalizedRating !== null) {
					const updated = await db
						.update(puzzleSolves)
						.set({ rating: normalizedRating })
						.where(and(eq(puzzleSolves.userId, userId), eq(puzzleSolves.puzzleId, puzzleId)))
						.returning();
					return NextResponse.json(updated[0]);
				}
				return NextResponse.json({ message: "Already solved" }, { status: 200 });
			}
			throw error;
		}
	} catch (error) {
		console.error(`POST /api/puzzles/${puzzleId}/solves error`, error);
		return NextResponse.json({ error: "Failed to record solve" }, { status: 500 });
	}
}
