# Next.js lint directory matching

The root npm override replaces `fast-glob` only inside
`@next/eslint-plugin-next` with this private workspace adapter. It removes the
`fast-glob → micromatch → braces` dependency chain affected by
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Next.js 15's plugin uses only `globSync` with `onlyDirectories: true` in
`get-root-dirs`. The adapter implements that use with `tinyglobby`, keeping
literal directories, glob patterns, and path formatting compatible. It is not a
general replacement for every fast-glob API.

Run `npm test --workspace=@pdfslick/eslint-glob` after changing the Next.js lint
dependency. The tests exercise the installed plugin's directory resolver and
lint rules. Remove the override and adapter when Next.js ships a dependency
chain without the affected `braces` package.

Use npm 11.13.0 or newer with Node 22.20.0+, Node 24.15.0+, or Node 26+.
The repository's `.nvmrc` selects Node 26 for the default development and CI setup.
The adapter passed clean-install and integration checks with Node 22.19.0 and
npm 11.13.0 on macOS. Node 22.20.0 is the supported baseline across platforms
because the optional Linux x64 GNU LZMA dependency declares that minimum.
The root dev dependency installs this adapter under the name `fast-glob`; the
scoped override references that dependency to share its local resolution.
A clean `npm ci` must also pass the adapter tests before changing this layout.
