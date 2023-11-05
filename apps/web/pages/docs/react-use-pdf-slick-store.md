---
title: usePDFSlickStore()
description: React usePDFSlickStore() hook.
---

This is basically a [Zustand](https://github.com/pmndrs/zustand) store that handles and gives access to PDFSlick's state:

```ts
{
   isDocumentLoaded: boolean;
   pagesReady: boolean;
   numPages: number;
   pageNumber: number;
   scale: number;
   scaleValue: string | undefined;
   pagesRotation: number;
   spreadMode: number;
   scrollMode: number;
   url: string | null;
   filename?: string;
   filesize?: number;
   title?: string;
   author?: string;
   subject?: string;
   keywords?: any;
   creationDate?: Date | null;
   modificationDate?: Date | null;
   creator?: string;
   producer?: string;
   version?: string;
   pageSize?: any;
   isLinearized?: boolean;
   documentOutline: TPDFDocumentOutline | null;
   attachments: Map<string, TPDFDocumentAttachment>;
   annotationEditorMode: number;
   thumbnailViews: Map<number, PDFThumbnailView>;
   thumbnails: Map<number, {
       pageNumber: number;
       width: number;
       height: number;
       scale: number;
       rotation: number;
       loaded: boolean;
       pageLabel: string | null;
       src: string | null;
   }>;
   pdfSlick: PDFSlick | null;
}
```

So for example, to get the current scale and the number of pages of the PDF document, and show it somewhere in a component we could use `usePDFSlickStore()` like in the following code:

```tsx
const currentScale = usePDFSlickStore(state => state.scale);
const numPages = usePDFSlickStore(state => state.numPages);

// ... and use it later on in your component's JSX
<p>The current scale is: {currentScale}</p>
<p>The number of pages is: {numPages}</p>

```
