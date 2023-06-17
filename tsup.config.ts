import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/deploy-commands.ts"],
  format: ["esm"],
  clean: true,
  bundle: true,
});
