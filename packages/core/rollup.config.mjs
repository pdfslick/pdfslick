import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import { esmConfig, umdConfig } from "@pdfslick/rollup-config";

const require = createRequire(import.meta.url);
const isProd = process.env.NODE_ENV === "production";

/**
 * `GlobalWorkerOptions.workerSrc` is set (in index.ts) to a URL relative to
 * this package's own built module, so pdf.js's worker file needs to
 * physically exist alongside each build's output. `fileName` here must match
 * that relative path exactly, for both the esm and umd outputs.
 */
function pdfjsWorkerPlugin() {
  return {
    name: "pdfjs-worker",
    buildStart() {
      const workerPath = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
      this.emitFile({
        type: "asset",
        fileName: "pdfjs-dist/build/pdf.worker.min.mjs",
        source: readFileSync(workerPath),
      });
    },
  };
}

const withWorker = (config) => ({
  ...config,
  plugins: [...config.plugins, pdfjsWorkerPlugin()],
});

export default isProd
  ? [withWorker(esmConfig), withWorker(umdConfig)]
  : withWorker(esmConfig);
