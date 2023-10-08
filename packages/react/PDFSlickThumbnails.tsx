import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMeasure, useDebounce } from "react-use";
import type { TUsePDFSlickStore } from "./";

export type PDFSlickThumbProps = {
  pageNumber: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  loaded: boolean;
  pageLabel: string | null;
  src: string | null;
};

export type PDFSlickThumbnailsContainerProps = {
  children: ({
    pageNumber,
    src,
    width,
    height,
    scale,
    rotation,
    pageLabel,
    loaded,
  }: PDFSlickThumbProps) => ReactNode;
  thumbsRef: (instance: HTMLElement | null) => void;
  usePDFSlickStore: TUsePDFSlickStore;
  className?: string;
};

export function PDFSlickThumbnails({
  children: renderChild,
  thumbsRef,
  usePDFSlickStore,
  className,
}: PDFSlickThumbnailsContainerProps) {
  const thumbnailViews = usePDFSlickStore((s) => s.thumbnailViews);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  const [resizeRef, { width }] = useMeasure<HTMLDivElement>();

  useDebounce(
    () => {
      if (width) {
        pdfSlick?.forceRendering();
      }
    },
    0,
    [width]
  );

  return (
    <div
      ref={(el) => {
        thumbsRef(el);
        resizeRef(el!);
      }}
      {...{ className }}
      style={{
        position: "absolute",
        overflow: "auto",
        inset: 0,
      }}
    >
      {Array.from(thumbnailViews).map(([pageNumber, view]) =>
        createPortal(
          renderChild({
            pageNumber,
            width: view.canvasWidth,
            height: view.canvasHeight,
            scale: view.scale,
            src: view?.src ?? null,
            rotation: view.rotation,
            pageLabel: view.pageLabel,
            loaded: view.loaded,
          }),
          view.div
        )
      )}
    </div>
  );
}
