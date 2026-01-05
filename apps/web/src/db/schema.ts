import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const puzzles = pgTable("puzzles", {
	id: serial("id").primaryKey(),
	movieName: text("movie_name").notNull(),
	creator: text("creator"),
	posterUrl: text("poster_url"),
	puzzle: text("puzzle").notNull(),
	answer: text("answer").notNull(),
	rating: integer("rating"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const puzzleSolves = pgTable(
	"puzzle_solves",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		puzzleId: integer("puzzle_id")
			.notNull()
			.references(() => puzzles.id, { onDelete: "cascade" }),
		rating: integer("rating"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.puzzleId] }),
	}),
);
