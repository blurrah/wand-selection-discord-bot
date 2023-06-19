CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"guild_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wands" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"wood" text NOT NULL,
	"core" text NOT NULL,
	"length" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wands" ADD CONSTRAINT "wands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
