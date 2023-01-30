import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    clean: true,
    minify: false,
    format: ["esm", "cjs"],
});
