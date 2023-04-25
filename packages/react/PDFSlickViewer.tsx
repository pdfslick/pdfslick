import { useMeasure, useDebounce } from "react-use";
import type { TUsePDFSlickStore } from "@pdfslick/react";

export type PDFSlickViewerProps = {
  viewerRef: (instance: HTMLElement) => void;
  usePDFSlickStore: TUsePDFSlickStore;
  className?: string;
};

export default function PDFSlickViewer({
  usePDFSlickStore,
  viewerRef,
  className,
}: PDFSlickViewerProps) {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const scaleValue = usePDFSlickStore((s) => s.scaleValue);

  const [resizeRef, { width }] = useMeasure<HTMLDivElement>();

  useDebounce(
    () => {
      if (width) {
        if (
          pdfSlick &&
          (scaleValue === "auto" ||
            scaleValue === "page-fit" ||
            scaleValue === "page-width")
        ) {
          pdfSlick.viewer.currentScaleValue = scaleValue;
        }
        pdfSlick?.viewer.update();
      }
    },
    0,
    [width]
  );

  return (
    <div
      ref={(el) => {
        viewerRef(el!);
        resizeRef(el!);
      }}
      id="viewerContainer"
      className={`pdfSlickContainer ${className ?? ""}`}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <div id="viewer" className="pdfSlickViewer pdfViewer" />
    </div>
  );
}
