// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not configured");
	}

	const sql = neon(databaseUrl);
	// Replace this placeholder query with real data when available.
	const data = await sql`SELECT now()`;
	return data;
}
