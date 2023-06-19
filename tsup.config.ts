import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/deploy-commands.ts", "src/migrate-database.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  bundle: true,
});
