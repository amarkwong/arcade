import { resolve } from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load env in this order: app-local, app, repo-local, repo.
dotenv.config({ path: resolve(__dirname, ".env.local") });
dotenv.config({ path: resolve(__dirname, ".env") });
dotenv.config({ path: resolve(__dirname, "../../.env.local") });
dotenv.config({ path: resolve(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
	throw new Error(
		"DATABASE_URL is not set; define it in apps/web/.env.local or repo .env",
	);
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
