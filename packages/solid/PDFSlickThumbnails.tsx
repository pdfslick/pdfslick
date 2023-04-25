import { JSXElement, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { createElementSize } from "@solid-primitives/resize-observer";
import type { PDFSlickState } from "@pdfslick/solid";

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
  }: PDFSlickThumbProps) => JSXElement;
  thumbsRef: (instance: HTMLElement) => void;
  store: PDFSlickState;
  class?: string;
  classList?: Record<string, boolean>
};

export function PDFSlickThumbnails(props: PDFSlickThumbnailsContainerProps) {
  const [resizeRef, setResizeRef] = createSignal<HTMLElement>();
  const size = createElementSize(resizeRef);

  createEffect(() => {
    if (size.width && size.height) {
      props.store.pdfSlick?.forceRendering();
    }
  });

  return (
    <div
      ref={(el) => {
        props.thumbsRef(el);
        setResizeRef(el);
      }}
      class={props.class ?? ""}
      classList={props.classList ?? {}}
      style={{
        position: "absolute",
        overflow: "auto",
        inset: 0,
      }}
    >
      <For each={Array.from(props.store.thumbnailViews)}>
        {([pageNumber, view]) => (
          <Portal mount={view.div}>
            {props.children({
              pageNumber,
              width: view.canvasWidth,
              height: view.canvasHeight,
              scale: view.scale,
              src: view?.src ?? null,
              rotation: view.rotation,
              pageLabel: view.pageLabel,
              loaded: view.loaded,
            })}
          </Portal>
        )}
      </For>
    </div>
  );
}
