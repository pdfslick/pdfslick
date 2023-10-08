<br><br>

![readme-header](https://pdfslick.dev/pdfslick_logo.svg)

<br><br>

<div align="center">
View and Interact with PDF documents in React apps
<br><br>

[Getting Started](https://pdfslick.dev/docs) | [Examples](https://pdfslick.dev/examples)

<br><br>

</div>

---

<br>

PDFSlick for React is a library which enables viewing of and interaction with PDF documents in React apps.
It's build on top of Mozilla's [PDF.js](https://github.com/mozilla/pdf.js), and utilises [Zustand](https://github.com/pmndrs/zustand) to provide a reactive store for the loaded documents.

## Getting started with PDFSlick for React

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

## Thanks

- [Vane Kosturanov](https://kosturanov.com/portfolio/logo-branding-design) for designing the logo
- [VS Code Icons](https://github.com/microsoft/vscode-codicons) for the icons used throughout the examples
