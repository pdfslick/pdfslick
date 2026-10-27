import { type Accessor, createEffect, createSignal } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";
import type { PDFSlick, PDFSlickState } from "@pdfslick/core";

export type PDFSlickViewerProps = {
  viewerRef: (instance: HTMLElement) => void;
  store: PDFSlickState;
  pdfSlick: Accessor<PDFSlick | null>
  class?: string;
};

export default function PDFSlickViewer(props: PDFSlickViewerProps) {
  const [resizeRef, setResizeRef] = createSignal<HTMLElement>();

  const size = createElementSize(resizeRef);
  createEffect(
    () => ({
    	width: size.width,
     	height: size.height,
      scaleValue: props.store.scaleValue,
      pdfSlick: props.pdfSlick(),
    }),
    ({ width, height, scaleValue, pdfSlick }) => {
      if (!width || !height || !pdfSlick) return;

      if (
        scaleValue === "auto" ||
        scaleValue === "page-fit" ||
        scaleValue === "page-width"
      ) {
        pdfSlick.viewer.currentScaleValue = scaleValue;
      }
      pdfSlick.viewer.update();
    });

  return (
    <div
      ref={(el) => {
        props.viewerRef(el);
        setResizeRef(el);
      }}
      id="viewerContainer"
      class={`pdfSlickContainer ${props.class ?? ""}`}
      style={{
        "position": "absolute",
        "inset": 0,
        "overflow": "auto"
      }}
    >
      <div id="viewer" class="pdfSlickViewer pdfViewer" />
    </div>
  );
}
