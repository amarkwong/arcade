import { db, users } from "@/db/client";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	let body: { name?: string };
	try {
		body = (await request.json()) as { name?: string };
	} catch (error) {
		console.error("POST /api/users invalid JSON", error);
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const trimmed = body.name?.trim();
	if (!trimmed) {
		return NextResponse.json({ error: "Name is required" }, { status: 400 });
	}

	try {
		// Reuse existing user if same name exists; otherwise insert a new one.
		const existing = await db.select().from(users).where(eq(users.name, trimmed)).limit(1);
		if (existing.length > 0) {
			return NextResponse.json({ id: existing[0].id, name: existing[0].name });
		}

		const inserted = await db
			.insert(users)
			.values({ name: trimmed })
			.returning({ id: users.id, name: users.name });

		if (!inserted[0]) {
			console.error("POST /api/users: insert returned empty result");
			return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
		}

		return NextResponse.json(inserted[0], { status: 201 });
	} catch (error: unknown) {
		const dbError = error as { code?: string };
		// Handle unique constraint race condition: return existing if name already exists.
		if (dbError?.code === "23505") {
			const existing = await db.select().from(users).where(eq(users.name, trimmed)).limit(1);
			if (existing.length > 0) {
				return NextResponse.json({
					id: existing[0].id,
					name: existing[0].name,
				});
			}
		}

		console.error("POST /api/users error", error);
		return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
	}
}
