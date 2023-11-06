---
title: Getting started with Svelte
description: PDFSlick for Svelte.
---

Svelte is basically vanilla JavaScript, so you can use the core package.

To get started with PDFSlick for Svelte run:

```shell
npm install @pdfslick/core
# yarn add @pdfslick/core
# pnpm add @pdfslick/core
```

You can load a PDF document and subscribe to a portion of or the entire PDFSlick store's state, like in the following basic example:

```svelte
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
    <div id="viewerContainer" class="pdfSlickContainer absolute inset-0" bind:this={container}>
      <div id="viewer" class="pdfSlickViewer pdfViewer" />
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

For usage examples with Svelte take a look at [the simple PDF Viewer](https://github.com/pdfslick/pdfslick/blob/main/apps/svelteweb/src/routes/simple-pdf-viewer/+page.svelte) and [the complete PDF Viewer App in Svelte](https://github.com/pdfslick/pdfslick/tree/main/apps/svelteweb/src/lib/PDFViewerApp) in the repo. There are also [React examples](https://github.com/pdfslick/pdfslick/tree/main/apps/web/examples) that might be helpful.

{% callout type="warning" title="Important Note" %}
PDFSlick provides a CSS file containing styles that are required in order for it to function properly. This file needs to be imported once, somewhere in your app (`AppComponent.svelte`, or `+layout.svelte`, `+page.svelte` etc.)

{% /callout %}

```js
import "@pdfslick/solid/dist/pdf_viewer.css";
```
