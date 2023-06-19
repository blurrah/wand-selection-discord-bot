import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./db/schema";

const migrationClient = postgres(process.env.POSTGRES_CONNECTION_STRING ?? "", {
  max: 1,
  ssl: true,
});

await migrate(drizzle(migrationClient, { schema }), {
  migrationsFolder: "drizzle",
});

process.exit(0);
