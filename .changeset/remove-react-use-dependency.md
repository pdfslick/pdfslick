---
"@pdfslick/react": patch
---

Remove the `react-use` runtime dependency. `useMeasure` and `useDebounce` are now implemented locally (`ResizeObserver` + `setTimeout`), eliminating the transitive `js-cookie` advisory (GHSA-qjx8-664m-686j) for consumers and dropping several transitive dependencies. No public API change.
