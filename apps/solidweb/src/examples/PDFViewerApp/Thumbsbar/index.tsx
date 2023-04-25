import { createEffect, createSignal, type Accessor } from "solid-js";

import { type PDFSlickState } from "@pdfslick/solid";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import ButtonsBar from "./ButtonsBar";
import Thumbnails from "./Thumbnails";
import Outline from "./Outline";
import Attachments from "./Attachments";

type ThumbsbarProps = {
  store: PDFSlickState;
  isThumbsbarOpen: Accessor<boolean>;
  thumbsRef: (instance: HTMLElement) => void;
};

const Thumbsbar = ({ store, isThumbsbarOpen, thumbsRef }: ThumbsbarProps) => {
  const [tab, setTab] = createSignal<"thumbnails" | "outline" | "attachments">(
    "thumbnails"
  );

  let containerRef: HTMLDivElement | undefined;
  let resizerRef: HTMLDivElement | undefined;
  const [isResizing, setIsResizing] = createSignal(false);
  const [width, setWidth] = createSignal(233);

  createEffect(() => {
    if (containerRef) {
      let newWidth = 0;

      const dragResize = drag<HTMLDivElement, unknown>()
        .on("start", (e) => {
          newWidth = containerRef!.clientWidth;
          setIsResizing(true);
        })
        .on("drag", (e) => {
          newWidth += e.dx;
          const width = Math.min(620, Math.max(233, newWidth));
          setWidth(width);
        })
        .on("end", (e) => {
          setIsResizing(false);
        });

      select(resizerRef!).call(dragResize);
    }
  });

  return (
    <>
      <div
        ref={containerRef}
        class={`h-full flex relative bg-slate-50 border-r border-slate-300 [box-shadow:1px_0_2px_0_rgb(0_0_0_/_0.05)]`}
        classList={{
          "transition-all": !isResizing(),
          visible: isThumbsbarOpen(),
          "invisible border-r-0 overflow-hidden": !isThumbsbarOpen(),
        }}
        style={{
          width: `${isThumbsbarOpen() ? width() : 0}px`,
        }}
      >
        <ButtonsBar {...{ tab, setTab, store, isThumbsbarOpen }} />

        <div
          class={`flex-1 relative`}
          classList={{
            "translate-x-0 visible opacity-100": isThumbsbarOpen(),
            "-translate-x-full invisible opacity-0": !isThumbsbarOpen(),
          }}
        >
          <Thumbnails show={tab() === "thumbnails"} {...{ thumbsRef, store }} />
          <Outline show={tab() === "outline"} {...{ store }} />
          <Attachments show={tab() === "attachments"} {...{ store }} />
        </div>
      </div>
      <div ref={resizerRef} class="hover:cursor-col-resize relative w-0">
        {isThumbsbarOpen() && (
          <div
            class={`absolute -left-px top-0 h-full z-10 w-1 transition-all duration-150 ease-in hover:delay-150 hover:duration-150 ${
              isResizing() ? "bg-blue-400" : "bg-transparent hover:bg-blue-400"
            }`}
          />
        )}
      </div>
    </>
  );
};

export default Thumbsbar;
