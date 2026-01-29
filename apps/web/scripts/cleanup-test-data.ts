import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { like, or } from "drizzle-orm";
import * as schema from "../src/db/schema";

// Only allow cleanup in CI environment
if (process.env.CI !== "true") {
	console.error("Error: This script can only run in CI environment (CI=true)");
	process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error("Error: DATABASE_URL is not set");
	process.exit(1);
}

const db = drizzle(neon(connectionString), { schema });

async function cleanupTestData() {
	console.log("Starting test data cleanup...");

	// Delete test puzzles (cascade will handle puzzle_solves)
	// Patterns: "Test Movie %", "TestMovie-%"
	const deletedPuzzles = await db
		.delete(schema.puzzles)
		.where(
			or(
				like(schema.puzzles.movieName, "Test Movie %"),
				like(schema.puzzles.movieName, "TestMovie-%")
			)
		)
		.returning({ id: schema.puzzles.id, movieName: schema.puzzles.movieName });

	console.log(`Deleted ${deletedPuzzles.length} test puzzles`);

	// Delete test users (cascade will handle puzzle_solves)
	// Patterns: "TestUser-%", "SpacedUser-%"
	const deletedUsers = await db
		.delete(schema.users)
		.where(
			or(
				like(schema.users.name, "TestUser-%"),
				like(schema.users.name, "SpacedUser-%")
			)
		)
		.returning({ id: schema.users.id, name: schema.users.name });

	console.log(`Deleted ${deletedUsers.length} test users`);

	console.log("Test data cleanup complete!");
}

cleanupTestData().catch((error) => {
	console.error("Cleanup failed:", error);
	process.exit(1);
});
