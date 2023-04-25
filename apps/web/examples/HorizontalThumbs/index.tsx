import { usePDFSlick } from "@pdfslick/react";
import Thumbnails from "./Thumbnails";

import "@pdfslick/react/dist/pdf_viewer.css";

type HorizontalThumbsProps = {
  pdfFilePath: string;
};

export default function HorizontalThumbs({
  pdfFilePath,
}: HorizontalThumbsProps) {
  const { viewerRef, thumbsRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(
    pdfFilePath,
    { thumbnailWidth: 75, scaleValue: "page-fit" }
  );

  return (
    <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
          </div>
        </div>
        <Thumbnails {...{ thumbsRef, usePDFSlickStore }} />
      </div>
    </div>
  );
}
