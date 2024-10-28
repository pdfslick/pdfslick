import { useEffect, useState } from "react";
import { usePDFSlick } from "@pdfslick/react";
import Toolbar from "./Toolbar";
import Thumbsbar from "./Thumbsbar";

type PDFViewerAppProps = {
  pdfFilePath: string;
};

export default function PDFViewerApp({ pdfFilePath }: PDFViewerAppProps) {
  const [isThumbsbarOpen, setIsThumbsbarOpen] = useState(false);
  const {
    isDocumentLoaded,
    viewerRef,
    thumbsRef,
    usePDFSlickStore,
    PDFSlickViewer,
  } = usePDFSlick(pdfFilePath);

  useEffect(() => {
    if (isDocumentLoaded) {
      setIsThumbsbarOpen(true);
    }
  }, [isDocumentLoaded]);

  return (
    <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
      <Toolbar {...{ usePDFSlickStore, setIsThumbsbarOpen, isThumbsbarOpen }} />
      <div className="flex-1 flex">
        <Thumbsbar {...{ thumbsRef, usePDFSlickStore, isThumbsbarOpen }} />

        <div className="flex-1 relative h-full">
          <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
        </div>
      </div>
    </div>
  );
}
