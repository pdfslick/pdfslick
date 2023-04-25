/** @jsxImportSource solid-js */
import { createEffect, createSignal } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";
import type { PDFSlickState } from "@pdfslick/core";

export type PDFSlickViewerProps = {
  viewerRef: (instance: HTMLElement) => void;
  store: PDFSlickState;
  class?: string;
};

export default function PDFSlickViewer(props: PDFSlickViewerProps) {
  const [resizeRef, setResizeRef] = createSignal<HTMLElement>();

  const size = createElementSize(resizeRef);
  createEffect(() => {
    if (size.width && size.height) {
      if (
        props.store.pdfSlick &&
        (props.store.scaleValue === "auto" ||
          props.store.scaleValue === "page-fit" ||
          props.store.scaleValue === "page-width")
      ) {
        props.store.pdfSlick.viewer.currentScaleValue = props.store.scaleValue;
      }
      props.store.pdfSlick?.viewer.update();
    }
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
        position: "absolute",
        inset: 0,
      }}
    >
      <div id="viewer" class="pdfSlickViewer pdfViewer" />
    </div>
  );
}
