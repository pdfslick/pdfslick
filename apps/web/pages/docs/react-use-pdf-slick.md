---
title: usePDFSlick()
description: React usePDFSlick() hook.
---

This is the hook that creates a PDFSlick instance and loads a PDF document.

### Syntax

```ts
const {
  isDocumentLoaded,
  viewerRef,
  thumbsRef,
  store,
  usePDFSlickStore,
  PDFSlickViewer,
  PDFSlickThumbnails,
} = usePDFSlick(pdfFilePath, options?);
```

### Parametars

* `pdfFilePath` Path to the PDF document

* `options` Additional options
```ts
{
    textLayerMode?: number,
    annotationMode?: number,
    annotationEditorMode?: number,
    singlePageViewer?: boolean,
    removePageBorders?: boolean,
    enablePrintAutoRotate?: boolean,
    useOnlyCssZoom?: boolean,
    pageColors?: {
        background: any,
        foreground: any,
    },
    l10n?: any,
    maxCanvasPixels?: number,
    printResolution?: number,
    thumbnailWidth?: number,
    scaleValue?: string,
    filename?: string,
}
```

### Return value

The hook returns the following object:

```tsx
{
  isDocumentLoaded: boolean;
  viewerRef: RefCallback<HTMLElement>;
  thumbsRef: RefCallback<HTMLElement>;
  store: StoreApi<PDFSlickState>;
  usePDFSlickStore: TUsePDFSlickStore;
  PDFSlickViewer: typeof PDFSlickViewer;
  PDFSlickThumbnails: typeof PDFSlickThumbnails;
}
```
where `<PDFSlickViewer />` and `<PDFSlickThumbnails />` are the PDF viewer and thumbnails components respectively, and `usePDFSlickStore` is the hook that gives access to PDFSlick store.
