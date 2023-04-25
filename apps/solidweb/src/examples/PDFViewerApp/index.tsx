import { Component, createSignal } from "solid-js";
import { usePDFSlick } from "@pdfslick/solid";
import Thumbsbar from "./Thumbsbar";
import Toolbar from "./Toolbar";

type PDFViewerAppProps = {
  pdfFilePath: string;
};

const PDFViewerApp: Component<PDFViewerAppProps> = ({ pdfFilePath }) => {
  const { viewerRef, thumbsRef, pdfSlickStore: store, PDFSlickViewer } =
    usePDFSlick(pdfFilePath);
  const [isThumbsbarOpen, setIsThumbsbarOpen] = createSignal(true);

  return (
    <div class="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
      <Toolbar {...{ store, setIsThumbsbarOpen, isThumbsbarOpen }} />
      <div class="flex-1 flex">
        <Thumbsbar {...{ store, isThumbsbarOpen, thumbsRef }} />

        <div class="flex-1 relative h-full">
          <PDFSlickViewer {...{ store, viewerRef }} />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerApp;
