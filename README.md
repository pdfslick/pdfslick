<br><br>

![readme-header](https://pdfslick.dev/pdfslick_logo.svg)

<br><br>

<div align="center">
View and Interact with PDF documents in React, SolidJS, Svelte and JavaScript apps
<br><br>

[![Actions Status](https://github.com/pdfslick/pdfslick/actions/workflows/publish_site.yml/badge.svg)](https://github.com/pdfslick/pdfslick/actions)
[![GitHub release](https://img.shields.io/github/release/pdfslick/pdfslick.svg)](https://github.com/pdfslick/pdfslick/)
[![npm version](https://img.shields.io/npm/v/@pdfslick/core.svg)](https://www.npmjs.com/package/@pdfslick/core)
[![npm](https://img.shields.io/npm/dt/@pdfslick/core.svg)](https://www.npmjs.com/package/@pdfslick/core)

<!-- [![npm](https://img.shields.io/npm/dt/@pdfslick/react.svg)](https://www.npmjs.com/package/@pdfslick/react)
[![npm](https://img.shields.io/npm/dt/@pdfslick/solid.svg)](https://www.npmjs.com/package/@pdfslick/solid) -->

<br>

[Getting Started](https://pdfslick.dev/docs) | [Examples](https://pdfslick.dev/examples)
<br><br>

</div>

---

<br>

PDFSlick is a library that enables viewing of and interaction with PDF documents in React, SolidJS, Svelte and JavaScript apps.
It's build on top of Mozilla's [PDF.js](https://github.com/mozilla/pdf.js), and utilises [Zustand](https://github.com/pmndrs/zustand) to provide a reactive store for the loaded documents.

## PDFSlick for React

To get started with React run:

```shell
npm install @pdfslick/react
# yarn add @pdfslick/react
# pnpm add @pdfslick/react
```

You can start using PDFSlick with the `usePDFSlick()` hook, like with the following basic example:

```jsx
import { usePDFSlick } from "@pdfslick/react";
import PDFNavigation from "./yourcomponents/PDFNavigation";

//
// It is required to include PDFSlick's CSS styles once
// you can do it in your main `App.tsx` for example
//
import "@pdfslick/react/dist/pdf_viewer.css";

type PDFViewerComponentProps = {
  pdfFilePath: string,
};

const PDFViewerComponent = ({ pdfFilePath }: PDFViewerComponent) => {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(
    pdfFilePath,
    {
      scaleValue: "page-fit",
    }
  );

  /*
   Access the store with `usePDFSlickStore()` hook — you can pass is
   as a prop to other components (like with `<PDFNavigation />` below)
   Toolbars, Sidebars, components which render thumbnails etc. 
   and use it as here to get and react on 
   PDF document's and viewer's properties and changes
   */
  const scale = usePDFSlickStore((s) => s.scale);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const pageNumber = usePDFSlickStore((s) => s.pageNumber);

  return (
    <div className="absolute inset-0 pdfSlick">
      <div className="relative h-full">
        <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />

        {/*
          Pass PDFSlick's store to your custom components
        */}
        <PDFNavigation {...{ usePDFSlickStore }} />

        {/*
          PDFSlick's store values automatically update
        */}
        <div className="absolute w-full top-0 left-0">
          <p>Current scale: {scale}</p>
          <p>Current page number: {pageNumber}</p>
          <p>Total number of pages: {numPages}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerComponent;
```

Provided with the PDF Document path and PDFSlick options object, the `usePDFSlick()` hook returns an object consisting (among the other things) of:

- `PDFSlickViewer` is the PDF Viewer component used for viewing the PDF document
- `viewerRef` is the `ref` callback that is provided as a prop to the `<PDFSlickViewer />` component
- `usePDFSlickStore` enables using PDFSlick store within your React components

<br>

[More on using PDFSlick with React](https://pdfslick.dev/docs/react) | [Checkout the React Examples](./apps/web/examples)

<br>

## PDFSlick for SolidJS

To get started with PDFSlick for SolidJS run:

```shell
npm install @pdfslick/solid
# yarn add @pdfslick/solid
# pnpm add @pdfslick/solid
```

You can start using PDFSlick with the `usePDFSlick()` hook, like with the following basic example:

```jsx
import { Component, createSignal } from "solid-js";
import { usePDFSlick } from "@pdfslick/solid";
import PDFNavigation from "./yourcomponents/PDFNavigation";

//
// It is required to include PDFSlick's CSS styles once
// you can do it in your main `App.tsx` for example
//
import "@pdfslick/solid/dist/pdf_viewer.css";

type PDFViewerComponentProps = {
  pdfFilePath: string,
};

const PDFViewerComponent: Component<PDFViewerComponentProps> = ({
  pdfFilePath,
}) => {
  const {
    viewerRef,
    pdfSlickStore: store,
    PDFSlickViewer,
  } = usePDFSlick(pdfFilePath);

  return (
    <div class="absolute inset-0 flex flex-col pdfSlick">
      <div class="flex-1 relative h-full">
        <PDFSlickViewer {...{ store, viewerRef }} />

        {/*
          Pass PDFSlick's store to your custom components (like the `<PDFNavigation />` below) —
          Toolbars, Sidebars, components which render thumbnails etc.
          and use it as here to get and react on 
          PDF document and viewer properties and changes
        */}
        <PDFNavigation {...{ store }} />

        {/*
          PDFSlick's store values automatically update
        */}
        <div className="absolute w-full top-0 left-0">
          <p>Current scale: {store.scale}</p>
          <p>Current page number: {store.pageNumber}</p>
          <p>Total number of pages: {store.numPages}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerComponent;
```

Provided with the PDF Document path and options object, the `usePDFSlick()` hook returns an object consisting (among the other things) of:

- `PDFSlickViewer` is the PDF Viewer component used for viewing the PDF document
- `viewerRef` is the `ref` callback that is provided as a prop to the `<PDFSlickViewer />` component
- `pdfSlickStore` is the PDFSlick store

<br>

[More on using PDFSlick with Solid](https://pdfslick.dev/docs/solid) | [Checkout the SolidJS Examples](./apps/solidweb/src/examples)

<br>

## PDFSlick for Svelte

To get started with PDFSlick for Svelte run:

```shell
npm install @pdfslick/core
# yarn add @pdfslick/core
# pnpm add @pdfslick/core
```

You can load a PDF document and subscribe to a portion of or the entire PDFSlick store's state, like in the following basic example:

```html
<script lang="ts">
  import type { PDFSlick } from '@pdfslick/core';
  import { onMount, onDestroy } from 'svelte';

  // ...

  /**
   * Reference to the PDF Viewer container
   */
  let container: HTMLDivElement;

  /**
   * Reference to the pdfSlick instance
   */
  let pdfSlick: PDFSlick;

  /**
   * Keep PDF Slick state portions we're interested in using in your app
   */
  let pageNumber = 1;
  let numPages = 0;

  onMount(async () => {
    /**
     * This is all happening on client side, so we'll make sure we only load it there
     */
    const { create, PDFSlick } = await import('@pdfslick/core');

    /**
     * Create the PDF Slick store 
     */
    const store = create();

    pdfSlick = new PDFSlick({
      container,
      store,
      options: {
        scaleValue: 'page-fit'
      }
    });

    /**
     * Load the PDF document
     */
    pdfSlick.loadDocument(url);
    store.setState({ pdfSlick });

    /**
     * Subscribe to state changes, and keep values of interest as reactive Svelte vars, 
     * (or alternatively we could hook these or entire PDF state into a Svelte store)
     * 
     * Also keep reference of the unsubscribe function we call on component destroy
     */
    unsubscribe = store.subscribe((s) => {
      pageNumber = s.pageNumber;
      numPages = s.numPages;
    });
  });

  onDestroy(() => unsubscribe());

	// ...
</script>

<!-- ... -->

<div class="absolute inset-0 bg-slate-200/70 pdfSlick">

  <div class="flex-1 relative h-full" id="container">
    <!--
      The important part —
      we use the reference to this `container` when creating PDF Slick instance above
    -->
    <div id="viewerContainer" class="pdfSlickContainer absolute inset-0 overflow-auto" bind:this={container}>
      <div id="viewer" class="pdfSlickViewer pdfViewer"></div>
    </div>
  </div>

  <!-- ... -->

  <!-- Use `pdfSlick`, `pageNumber` and `numPages` to create PDF pagination -->
  <div class="flex justify-center">
    <button
      on:click={() => pdfSlick?.gotoPage(Math.max(pageNumber - 1, 1))}
      disabled={pageNumber <= 1}
		>
      Show Previous Page
    </button>
    <button
      on:click={() =>  pdfSlick?.gotoPage(Math.min(pageNumber + 1, numPages))}
      disabled={pageNumber >= numPages}
    >
      Show Next Page
    </button>
  </div>

</div>

<!-- ... -->
```

<br>

[More on using PDFSlick with Svelte](https://pdfslick.dev/docs/svelte) | [Checkout the Svelte Examples](./apps/svelteweb/src)

<br>

## Motivation

[PDF.js](https://github.com/mozilla/pdf.js) is an amazing piece of software. It is also a very stable and mature one — it powers the PDF viewer in Mozilla Firefox and it's been around since 2011. However, it's all Vanilla JavaScript, and when it comes to using it with libraries like React and SolidJS (although possible) it's a litte bit hard in terms of integrating it in these Component- and reactive-like environments. PDFSlick attempts to wrap all of that fascinating functionality into one that is easier to fit in React and SolidJS worlds — as components and a reactive store.

## Core Concepts

The core of PDFSlick is within the `@pdfslick/core` package. It wraps `PDF.js`'s functionality and links it to the store. This `@pdfslick/core` package is the basis for the React and SolidJS packages, which additionally transform the store and make it suitable for the adequate library, as well as providing components for the PDF viewer and thumbnails.

Depending on your needs, at this you might find it useful to continue with learning more about using PDFSlick with React and SolidJS respsectivelly. However, if really interested you can learn more about using PDFSlick's `@pdfslick/core` package with Vanilla JS apps and with libraries other than React and SolidJS in the sections below.

<br>

[Learn more about PDFSlick](https://pdfslick.dev) | [Checkout the Examples](https://pdfslick.dev/examples)

## Author

PDFSlick was conceived and developed, and is currently maintained by [Vancho Stojkov](https://github.com/van100j), who embarked on this project with the vision of simplifying PDF integration for modern web frameworks, leveraging the power of PDF.js while providing a developer-friendly API.

## Thanks

- [Vane Kosturanov](https://kosturanov.com/portfolio/logo-branding-design) for designing the logo
- [VS Code Icons](https://github.com/microsoft/vscode-codicons) for the icons used throughout the examples
