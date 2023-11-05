---
title: View PDF Documents in React
description: Viewing PDF Documents in React with PDFSlick.
---

The `<PDFSlickViewer />` component is an essential part for viewing PDF documents. It expects the `viewerRef` and the `usePDFSlickStore` props, and optionally `className` may be also passed as a prop.

So for all PDF documents we want to show, once we call the `usePDFSlick()` hook and get the `PDFSlickViewer`, `viewerRef` and `usePDFSlickStore` we can render the document's PDF viewer:

```tsx
  ...

  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(pdfFilePath);

  return (
    ...
    <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
    ...
  );
```

---

## PDF Thumbnails

In addition to rendering pages, PDFSlick provides a component for rendering page thumbnails. Just like with `viewerRef` needed to reference the `<PDFSlickViewer />`, the `usePDFSlick()` hook returns a `thumbsRef` callback to be used for referencing the `<PDFSlickThumbnails />` components.

Here's an example for rendering PDF document viewer, and getting the `thumbRef` for the thumbnails component:

```tsx
import { useEffect, useState } from "react";
import { usePDFSlick } from "@pdfslick/react";
import Thumbsbar from "./Thumbsbar";

import "@pdfslick/react/dist/pdf_viewer.css";

type PDFViewerAppProps = {
  pdfFilePath: string,
};

export default function PDFViewerApp({ pdfFilePath }: PDFViewerAppProps) {
  const { viewerRef, thumbsRef, usePDFSlickStore, PDFSlickViewer } =
    usePDFSlick(pdfFilePath);

  return (
    <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
      <div className="flex-1 flex">
        {/*
          Note how we pass `thumbsRef` here to the
          sidebar component that will render the thumbnails
        */}
        <Thumbsbar {...{ thumbsRef, usePDFSlickStore }} />

        <div className="flex-1 relative h-full">
          <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
        </div>
      </div>
    </div>
  );
}
```

So now we can pass the `thumbsRef` to render the thumbnails for the PDF pages in a sidebar next to the main PDF viewer:

```tsx
import clsx from "clsx";
import { type TUsePDFSlickStore, PDFSlickThumbnails } from "@pdfslick/react";

type ThumbsbarProps = {
  usePDFSlickStore: TUsePDFSlickStore,
  thumbsRef: (instance: HTMLElement | null) => void,
};

const Thumbsbar = ({ usePDFSlickStore, thumbsRef, show }: ThumbsbarProps) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const currentPage = usePDFSlickStore((s) => s.pageNumber);

  return (
    <div className="overflow-auto absolute inset-0">
      <div className="px-2 relative h-full">
        {/*
            Note how we use `<PDFSlickThumbnails />` here
            with the passed `thumbsRef` prop to render the thumbnails...
        */}
        <PDFSlickThumbnails
          {...{
            thumbsRef,
            usePDFSlickStore,
            className: "grid grid-cols-3 gap-2 mx-auto pb-4",
          }}
        >
          {/*
              ...and how we pass a child that will render a thumbnail for each PDF page
           */}
          {({ pageNumber, width, height, src, pageLabel, loaded }) => (
            <div className="box-border pt-4 h-full w-full inline-flex justify-center">
              <div>
                <div className="flex justify-center">
                  <button
                    onClick={() => pdfSlick?.gotoPage(pageNumber)}
                    className={clsx(
                      "p-0.5",
                      {
                        "bg-blue-400 shadow":
                          loaded && pageNumber === currentPage,
                      },
                      { "bg-transparent": pageNumber !== currentPage },
                      { "bg-transparent": !loaded }
                    )}
                  >
                    <div
                      className={clsx("box-border relative border", {
                        "border-slate-300 border-solid bg-slate-400 bg-opacity-5 shadow-sm":
                          !loaded,
                        "border-slate-300 border-solid hover:border-blue-400 shadow hover:shadow":
                          loaded && pageNumber !== currentPage,
                        "border-transparent border-solid shadow-md":
                          loaded && pageNumber === currentPage,
                      })}
                      style={{
                        width: `${width + 2}px`,
                        height: `${height + 2}px`,
                      }}
                    >
                      {src && <img src={src} width={width} height={height} />}
                    </div>
                  </button>
                </div>
                <div className="text-center text-xs text-slate-500 py-2">
                  {pageLabel ?? pageNumber}
                </div>
              </div>
            </div>
          )}
        </PDFSlickThumbnails>
      </div>
    </div>
  );
};

export default Thumbsbar;
```

As we can see above PDFSlick's `<PDFSlickThumbnails />` component makes it easy to create and render thumbnails for each PDF page. It requires the `thumbsRef` and the `usePDFSlickStore` props, and optionally `className` may also be passed as a prop.

Very important to note here is that it expects a child component that is used to render each thumbnails. The child gets appropriate props for the page thumbnail: {% .lead %}

```tsx
<PDFSlickThumbnails {...{ thumbsRef, usePDFSlickStore }}>
  {({ pageNumber, width, height, src, pageLabel, rotation, scale, loaded }) => (
    <div className="...">
      {/* render the thumbnail here using src, width, height ... */}
    </div>
  )}
</PDFSlickThumbnails>
```
