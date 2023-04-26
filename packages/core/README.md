<br><br>

![readme-header](https://pdfslick.dev/pdfslick_logo.svg)

<br><br>
<div align="center">
View and Interact with PDFs in React and SolidJS apps
<br><br>

[Getting Started](https://pdfslick.dev/docs) | [Examples](https://pdfslick.dev/examples)

<br><br>
</div>

---
<br>

PDFSlick is a library that enables viewing of and interaction with PDF documents in React and SolidJS apps.
It's build on top of Mozilla's [PDF.js](https://github.com/mozilla/pdf.js), and utilises [Zustand](https://github.com/pmndrs/zustand) to provide a reactive store for the loaded documents.

## Motivation

[PDF.js](https://github.com/mozilla/pdf.js) is an amazing piece of software. It is also a very stable and mature one — it powers the PDF viewer in Mozilla Firefox and it's been around since 2011. However, it's all Vanilla JavaScript, and when it comes to using it with libraries like React and SolidJS (although possible) it's a litte bit hard in terms of integrating it in these Component- and reactive-like environments. PDFSlick attempts to wrap all of that fascinating functionality into one that is easier to fit in React and SolidJS worlds — as components and a reactive store.

## Core Concepts

The core of PDFSlick is within the `@pdfslick/core` package. It wraps `PDF.js`'s functionality and links it to the store. This `@pdfslick/core` package is the basis for the React and SolidJS packages, which additionally transform the store and make it suitable for the adequate library, as well as providing components for the PDF viewer and thumbnails.

Depending on your needs, at this you might find it useful to continue with learning more about using PDFSlick with React and SolidJS respsectivelly. However, if really interested you can learn more about using PDFSlick's `@pdfslick/core` package with Vanilla JS apps and with libraries other than React and SolidJS in the sections below.

## Getting Started with React

To get started with React run:
```shell
npm install @pdfslick/react
# yarn add @pdfslick/react
# pnpm add @pdfslick/react
```

You can start using PDFSlick with the `usePDFSlick()` hook, like with the following basic example:
```jsx
import { usePDFSlick } from "@pdfslick/react";
import PDFNavigation from "./PDFNavigation";

import "@pdfslick/react/dist/pdf_viewer.css";

type PDFViewerAppProps = {
  pdfFilePath: string;
};

const SimplePDFViewer = ({ pdfFilePath }: PDFViewerAppProps) => {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(pdfFilePath, {
    singlePageViewer: true,
    scaleValue: "page-fit"
  });

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

<br><br>
[Read more about using PDFSlick with React](https://pdfslick.dev/docs/react) | [Checkout the React Examples](./apps/web/examples)

## SolidJS

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
  pdfFilePath: string;
};

const PDFViewerApp: Component<PDFViewerAppProps> = ({ pdfFilePath }) => {
  const { viewerRef, pdfSlickStore: store, PDFSlickViewer } =
    usePDFSlick(pdfFilePath);

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

<br><br>
[Read more about using PDFSlick with SolidJS](https://pdfslick.dev/docs/solid) | [Checkout the SolidJS Examples](./apps/solidweb/src/examples)

