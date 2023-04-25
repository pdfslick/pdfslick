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
