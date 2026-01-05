import { NextRequest, NextResponse } from "next/server";
import { db, puzzles, puzzleSolves, users } from "@/db/client";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await db.select().from(puzzles).orderBy(asc(puzzles.id));

    const solves = await db
      .select({
        puzzleId: puzzleSolves.puzzleId,
        userId: puzzleSolves.userId,
        rating: puzzleSolves.rating,
        userName: users.name,
      })
      .from(puzzleSolves)
      .leftJoin(users, eq(users.id, puzzleSolves.userId));

    const solvesByPuzzle = solves.reduce<Record<number, typeof solves>>((acc, solve) => {
      const list = acc[solve.puzzleId] || [];
      list.push(solve);
      acc[solve.puzzleId] = list;
      return acc;
    }, {});

    const withSolves = results.map((puzzle) => ({
      ...puzzle,
      solves: solvesByPuzzle[puzzle.id] ?? [],
    }));

    return NextResponse.json({ puzzles: withSolves });
  } catch (error) {
    console.error("GET /api/puzzles error", error);
    return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { movieName, creator, posterUrl, puzzle, answer, rating } = (await request.json()) as {
      movieName?: string;
      creator?: string;
      posterUrl?: string;
      puzzle?: string;
      answer?: string;
      rating?: number | null;
    };

    const movie = movieName?.trim();
    const creatorName = creator?.trim();
    const puzzleText = puzzle?.trim();
    const answerText = answer?.trim();

    if (!movie || !puzzleText || !answerText) {
      return NextResponse.json({ error: "movieName, puzzle, and answer are required" }, { status: 400 });
    }

    const normalizedRating = typeof rating === "number" ? Math.round(rating) : null;
    if (normalizedRating !== null && (normalizedRating < 1 || normalizedRating > 5)) {
      return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
    }

    const inserted = await db
      .insert(puzzles)
      .values({ movieName: movie, creator: creatorName || null, posterUrl: posterUrl?.trim() || null, puzzle: puzzleText, answer: answerText, rating: normalizedRating ?? null })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/puzzles error", error);
    return NextResponse.json({ error: "Failed to create puzzle" }, { status: 500 });
  }
}
