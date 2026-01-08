import { resolve } from "node:path";
import dotenv from "dotenv";

// Load env in this order: app-local, app, repo-local, repo.
dotenv.config({ path: resolve(__dirname, ".env.local") });
dotenv.config({ path: resolve(__dirname, ".env") });
dotenv.config({ path: resolve(__dirname, "../../.env.local") });
dotenv.config({ path: resolve(__dirname, "../../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set; define it in apps/web/.env.local or repo .env");
}

const config = {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: databaseUrl,
	},
};

export default config;
