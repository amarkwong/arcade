import { db, users } from "@/db/client";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		const { name } = (await request.json()) as { name?: string };
		const trimmed = name?.trim();
		if (!trimmed) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		// Reuse existing user if same name exists; otherwise insert a new one.
		const existing = await db
			.select()
			.from(users)
			.where(eq(users.name, trimmed))
			.limit(1);
		if (existing.length > 0) {
			return NextResponse.json({ id: existing[0].id, name: existing[0].name });
		}

		const inserted = await db
			.insert(users)
			.values({ name: trimmed })
			.returning({ id: users.id, name: users.name });

		return NextResponse.json(inserted[0]);
	} catch (error: any) {
		// Handle unique constraint race condition: return existing if name already exists.
		if (error?.code === "23505") {
			const { name } = (await request.json()) as { name?: string };
			const trimmed = name?.trim() ?? "";
			const existing = await db
				.select()
				.from(users)
				.where(eq(users.name, trimmed))
				.limit(1);
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
