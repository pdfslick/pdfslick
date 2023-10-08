---
title: Introduction
pageTitle: PDFSlick
description: View and interact with PDFs in your React and SolidJS apps.
---

PDFSlick is a library that enables viewing of and interaction with PDF documents in React and SolidJS apps. It's build on top of Mozilla's [PDF.js](https://github.com/mozilla/pdf.js), and utilises [Zustand](https://github.com/pmndrs/zustand) to provide a reactive state for the loaded documents.

---

## Motivation

[PDF.js](https://github.com/mozilla/pdf.js) is an amazing piece of software. It is also a very stable and mature one — it powers the PDF viewer in Mozilla Firefox and it's been around since 2011. However, it's all Vanilla JavaScript, and when it comes to using it in modern JS libraries, like React and SolidJS, although possible it's still a litte bit hard in terms of integrating it in these Component- and reactive-like environments. PDFSlick attempts to wrap all of that fascinating functionality into one that is easier to fit in React and SolidJS worlds — as components and a reactive store.

## Core Concepts

The core of PDFSlick is within the `@pdfslick/core` package. It wraps `PDF.js`'s functionality and links it to the store. This `@pdfslick/core` package is the basis for the React and SolidJS packages, which additionally transform the store and make it suitable for the adequate library, as well as providing components for the PDF viewer and thumbnails.

Depending on your needs, at this you might find it useful to continue with learning more about using PDFSlick with React and SolidJS respsectivelly. However, if really interested you can learn more about using PDFSlick's `@pdfslick/core` package with Vanilla JS apps and with libraries other than React and SolidJS in the sections below.

{% quick-links %}

{% quick-link title="React" icon="react" href="/docs/react" description="Learn more about using PDFSlick with React." /%}

{% quick-link title="SolidJS" icon="solid" href="/docs/solid" description="Learn more about using PDFSlick with SolidJS." /%}

{% /quick-links %}

## PDFSlick core package

{% callout type="warning" title="Note on PDFSlick Core Package" %}
As mentioned above, the core package is intented for use in Vanilla JS apps or in other JS libraries other than React and SolidJS. If interested in using PDFSlick in your [React](/docs/react) and [SolidJS](/docs/solid) apps jump to their respective sections.
{% /callout %}

To install PDFSlick core package run:

```shell
npm install @pdfslick/core
# yarn add @pdfslick/core
# pnpm add @pdfslick/core
```

Once installed we need to create a store, a PDFSlick instance, and link these together. Finally, need to load the PDF document.

```typescript
import { create, PDFSlick } from "@pdfslick/core";

export function loadPdf(url: string = "/Path_to_the_PDF_Document.pdf") {
  const store = create();
  const container = document.querySelector<HTMLDivElement>("#viewerContainer")!;

  const pdfSlick = new PDFSlick({
    container,
    store,
    options: {
      scaleValue: "page-fit",
    },
  });
  pdfSlick.loadDocument(url);
  store.setState({ pdfSlick });

  const resizeObserver = new ResizeObserver(() => {
    const { scaleValue } = store.getState();
    if (scaleValue && ["page-width", "page-fit", "auto"].includes(scaleValue)) {
      pdfSlick.viewer.currentScaleValue = scaleValue;
    }
  });

  resizeObserver.observe(container);

  window.addEventListener("beforeunload", () => {
    resizeObserver.disconnect();
  });
}
```

As you can see above, the store gives us a neat ability to access PDF viewer's properties like, for example here, the current zoom level — via `store.getState().scaleValue`.

Assuming we have prepared our app with the appropriate [HTML buttons and other markup](https://github.com/pdfslick/pdfslick/blob/main/apps/vanillajs/index.html) we can create a toolbar and utilise the store to provide functionality for navigating through the PDF pages, changing the scale level etc.

```ts
import { create } from "@pdfslick/core";

export function setNavigation(store: ReturnType<typeof create>) {
  const zoomOutBtn = document.querySelector("#zoomOutBtn");
  const zoomInBtn = document.querySelector("#zoomInBtn");
  const previousBtn = document.querySelector("#previousBtn");
  const nextBtn = document.querySelector("#nextBtn");

  const unsubscribe = store.subscribe((s) => {
    if (s.pageNumber <= 1) {
      previousBtn?.setAttribute("disabled", "true");
    } else {
      previousBtn?.removeAttribute("disabled");
    }

    if (s.pageNumber >= s.numPages) {
      nextBtn?.setAttribute("disabled", "true");
    } else {
      nextBtn?.removeAttribute("disabled");
    }
  });

  const onZoomIn = () => store.getState().pdfSlick?.increaseScale();
  const onZoomOut = () => store.getState().pdfSlick?.decreaseScale();
  const onNextPage = () =>
    store.getState().pdfSlick?.gotoPage(store.getState().pageNumber + 1);
  const onPreviousPage = () =>
    store.getState().pdfSlick?.gotoPage(store.getState().pageNumber - 1);

  zoomInBtn?.addEventListener("click", onZoomIn);
  zoomOutBtn?.addEventListener("click", onZoomOut);
  nextBtn?.addEventListener("click", onNextPage);
  previousBtn?.addEventListener("click", onPreviousPage);

  window.addEventListener("beforeunload", () => {
    zoomInBtn?.removeEventListener("click", onZoomIn);
    zoomOutBtn?.removeEventListener("click", onZoomOut);
    nextBtn?.removeEventListener("click", onNextPage);
    previousBtn?.removeEventListener("click", onPreviousPage);

    unsubscribe();
  });
}
```

Take a look at a complete example of using [PDFSlick core package in a Vanilla JS app](https://github.com/pdfslick/pdfslick/tree/main/apps/vanillajs/src).

Going through the docs sections on React or SolidJS, as well as the examples there, might be also useful to learn more about the PDFSlick core.

{% quick-links %}

{% quick-link title="React" icon="react" href="/docs/react" description="Learn more about using PDFSlick with React." /%}

{% quick-link title="SolidJS" icon="solid" href="/docs/solid" description="Learn more about using PDFSlick with SolidJS." /%}

{% /quick-links %}
