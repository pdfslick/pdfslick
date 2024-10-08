---
title: Getting started with React
description: PDFSlick for React.
---

To get started with React run:

```shell
npm install @pdfslick/react
# yarn add @pdfslick/react
# pnpm add @pdfslick/react
```

You can start using PDFSlick with the `usePDFSlick()` hook, like with the following basic example:

```tsx
import { usePDFSlick } from "@pdfslick/react";
import PDFNavigation from "./PDFNavigation";

/** Import only once in root component like index.ts or root css.
import "@pdfslick/react/dist/pdf_viewer.css";
*/

type PDFViewerAppProps = {
  pdfFilePath: string,
};

const SimplePDFViewer = ({ pdfFilePath }: PDFViewerAppProps) => {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(
    pdfFilePath,
    {
      singlePageViewer: true,
      scaleValue: "page-fit",
    }
  );

  return (
    <div className="absolute inset-0 bg-slate-200/70 pdfSlick">
      <div className="flex-1 relative h-full">
        <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
        <PDFNavigation {...{ usePDFSlickStore }} />
      </div>
    </div>
  );
};

export default SimplePDFViewer;
```

Provided with the PDF Document path and options object, the `usePDFSlick()` hook returns an object consisting (among the other things) of:

- `PDFSlickViewer` — the PDF Viewer component used for viewing the PDF document
- `viewerRef` — a `RefCallback` that is provided as a prop to the `<PDFSlickViewer />` component
- `usePDFSlickStore` — a hook to the PDFSlick store

{% callout type="warning" title="Important Note" %}
PDFSlick provides a CSS file containing styles that are required in order for it to function properly. This file needs to be imported once, somewhere in your app (`index.tsx`, `App.tsx` etc.)
{% /callout %}

You can take a look at the code of [this and other examples](https://github.com/pdfslick/pdfslick/tree/main/apps/web/examples) available in the repo.
