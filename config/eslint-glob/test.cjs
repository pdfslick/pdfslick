const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { createRequire } = require("node:module");
const { Linter } = require("eslint");

const nextRequire = createRequire(require.resolve("@next/eslint-plugin-next"));
const nextPlugin = nextRequire("./index.js");
const { getRootDirs } = nextRequire("./utils/get-root-dirs.js");
const originalCwd = process.cwd();
let fixture;

before(() => {
  fixture = mkdtempSync(join(tmpdir(), "pdfslick-eslint-glob-"));
  mkdirSync(join(fixture, "apps/web/pages"), { recursive: true });
  mkdirSync(join(fixture, "apps/docs"), { recursive: true });
  writeFileSync(
    join(fixture, "apps/web/pages/about.js"),
    "export default () => null;",
  );
  writeFileSync(join(fixture, "apps/file.txt"), "not a directory");
  process.chdir(fixture);
});

after(() => {
  process.chdir(originalCwd);
  rmSync(fixture, { recursive: true, force: true });
});

function roots(rootDir) {
  return getRootDirs({ cwd: fixture, settings: { next: { rootDir } } }).sort();
}

test("the installed Next.js plugin resolves the safe adapter", () => {
  assert.equal(nextRequire("fast-glob"), require("./index.cjs"));
});

test("Next.js finds only matching project directories", () => {
  assert.deepEqual(roots("apps/*/"), ["apps/docs", "apps/web"]);
  assert.deepEqual(roots("./apps/*/"), ["./apps/docs", "./apps/web"]);
  assert.deepEqual(roots("apps/{docs,web}"), ["apps/docs", "apps/web"]);
  assert.deepEqual(roots(["apps/docs", "apps/web"]), ["apps/docs", "apps/web"]);
});

test("literal roots do not expand to nested directories", () => {
  assert.deepEqual(roots("apps/web"), ["apps/web"]);
  const absoluteRoot = join(fixture, "apps/web");
  assert.deepEqual(roots(absoluteRoot), [absoluteRoot.replace(/\\/g, "/")]);
  assert.deepEqual(roots("apps\\web"), ["apps/web"]);
});

test("missing roots and omitted settings keep Next.js behavior", () => {
  assert.deepEqual(roots("apps/missing"), []);
  assert.deepEqual(roots(undefined), [fixture]);
});

test("the Next.js lint rule still reports internal HTML links", () => {
  const linter = new Linter({ cwd: fixture });
  const config = {
    files: ["**/*.jsx"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "@next/next": nextPlugin },
    settings: { next: { rootDir: "apps/*/" } },
    rules: { "@next/next/no-html-link-for-pages": "error" },
  };
  const filename = join(fixture, "apps/web/pages/index.jsx");
  const errors = linter.verify(
    'const page = <a href="/about">About</a>;',
    config,
    { filename },
  );
  assert.equal(errors.length, 1);
  assert.equal(errors[0].ruleId, "@next/next/no-html-link-for-pages");
  assert.deepEqual(
    linter.verify(
      'const page = <a href="https://example.com">External</a>;',
      config,
      { filename },
    ),
    [],
  );
});
