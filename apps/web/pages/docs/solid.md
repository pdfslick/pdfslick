---
title: Getting started with SolidJS
description: PDFSlick for SolidJS.
---

To get started with PDFSlick for SolidJS React run:

```shell
npm install @pdfslick/solid
# yarn add @pdfslick/solid
# pnpm add @pdfslick/solid
```

You can start using PDFSlick with the `usePDFSlick()` hook, like with the following basic example:

```jsx
import { Component, createSignal } from "solid-js";
import { usePDFSlick } from "@pdfslick/solid";

type PDFViewerAppProps = {
  pdfFilePath: string,
};

const PDFViewerApp: Component<PDFViewerAppProps> = ({ pdfFilePath }) => {
  const {
    viewerRef,
    pdfSlickStore: store,
    PDFSlickViewer,
  } = usePDFSlick(pdfFilePath);

  return (
    <div class="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
      <div class="flex-1 relative h-full">
        <PDFSlickViewer {...{ store, viewerRef }} />
      </div>
    </div>
  );
};

export default PDFViewerApp;
```

Provided with the PDF Document path and options object, the `usePDFSlick()` hook returns an object consisting (among the other things) of:

- `PDFSlickViewer` — the PDF Viewer component used for viewing the PDF document
- `viewerRef` — a `RefCallback` that is provided as a prop to the `<PDFSlickViewer />` component
- `pdfSlickStore` — the PDFSlick store

{% callout type="warning" title="Important Note" %}
PDFSlick provides a CSS file containing styles that are required in order for it to function properly. This file needs to be imported once, somewhere in your app (`index.tsx`, `App.tsx` etc.)

```js
import "@pdfslick/solid/dist/pdf_viewer.css";
```

{% /callout %}

You can take a look at [the code for this example](https://github.com/pdfslick/pdfslick/tree/main/apps/solidweb/src/examples/PDFViewerApp) in the repo, and [the React examples](https://github.com/pdfslick/pdfslick/tree/main/apps/web/examples) which may also be helpful.
