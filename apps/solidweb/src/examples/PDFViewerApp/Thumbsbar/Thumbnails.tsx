import { createSignal, onMount } from "solid-js";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { type PDFSlickState, PDFSlickThumbnails } from "@pdfslick/solid";

type ThumbnailsProps = {
  store: PDFSlickState;
  thumbsRef: (instance: HTMLElement) => void;
  show: boolean;
};

const Thumbnails = (props: ThumbnailsProps) => {
  let ref!: HTMLDivElement;
  const [width, setWidth] = createSignal(200);

  const cols = () => Math.round(width() / 200);

  onMount(() => {
    createResizeObserver(ref, ({ width, height }, el) => {
      if (el === ref) {
        setWidth(width);
      }
    });
  });

  return (
    <div
      class="overflow-auto absolute inset-0"
      classList={{ invisible: !props.show }}
      ref={ref}
    >
      <div class="px-2 relative h-full">
        <PDFSlickThumbnails
          {...{ thumbsRef: props.thumbsRef, store: props.store }}
          class="grid gap-2 mx-auto pb-4"
          classList={{
            "grid-cols-1": cols() === 1,
            "grid-cols-2": cols() === 2,
            "grid-cols-3": cols() === 3,
            "grid-cols-4": cols() > 3,
          }}
        >
          {({ pageNumber, width, height, src, pageLabel, loaded }) => (
            <div class="box-border pt-4 h-full w-full inline-flex justify-center">
              <div>
                <div class="flex justify-center">
                  <button
                    onClick={() => props.store.pdfSlick?.gotoPage(pageNumber)}
                    class="p-0.5"
                    classList={{
                      "bg-blue-400 shadow":
                        loaded && pageNumber === props.store.pageNumber,
                      "bg-transparent":
                        pageNumber !== props.store.pageNumber || !loaded,
                    }}
                  >
                    <div
                      class="box-border relative border"
                      classList={{
                        "border-slate-300 border-solid bg-slate-400 bg-opacity-5 shadow-sm":
                          !loaded,
                        "border-slate-300 border-solid hover:border-blue-400 shadow hover:shadow":
                          loaded && pageNumber !== props.store.pageNumber,
                        "border-transparent border-solid shadow-md":
                          loaded && pageNumber === props.store.pageNumber,
                      }}
                      style={{
                        width: `${width + 2}px`,
                        height: `${height + 2}px`,
                      }}
                    >
                      {src && <img src={src} width={width} height={height} />}
                    </div>
                  </button>
                </div>
                <div class="text-center text-xs text-slate-500 py-2">
                  {pageLabel ?? pageNumber}
                </div>
              </div>
            </div>
          )}
        </PDFSlickThumbnails>
      </div>
    </div>
  );
};

export default Thumbnails;
