CREATE TABLE IF NOT EXISTS "puzzle_solves" (
	"user_id" integer NOT NULL,
	"puzzle_id" integer NOT NULL,
	"rating" integer,
	CONSTRAINT "puzzle_solves_user_id_puzzle_id_pk" PRIMARY KEY("user_id","puzzle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "puzzles" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_name" text NOT NULL,
	"creator" text,
	"poster_url" text,
	"puzzle" text NOT NULL,
	"answer" text NOT NULL,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "puzzle_solves" ADD CONSTRAINT "puzzle_solves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "puzzle_solves" ADD CONSTRAINT "puzzle_solves_puzzle_id_puzzles_id_fk" FOREIGN KEY ("puzzle_id") REFERENCES "public"."puzzles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
