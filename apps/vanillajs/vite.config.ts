import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // esbuild 0.28.1 (pinned via root overrides for security fixes) erroneously
    // tries to lower destructuring for the default `safari14` target and fails.
    // Targeting esnext avoids that lowering, matching apps/solidweb. See root
    // package.json overrides.
    target: "esnext",
  },
});
