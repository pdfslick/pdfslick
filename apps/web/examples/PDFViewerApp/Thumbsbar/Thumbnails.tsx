import clsx from "clsx";
import { useMeasure } from "react-use";
import { type TUsePDFSlickStore, PDFSlickThumbnails } from "@pdfslick/react";
import { useEffect, useState } from "react";

type ThumbnailsProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  thumbsRef: (instance: HTMLElement | null) => void;
  show: boolean;
};

const Thumbnails = ({ usePDFSlickStore, thumbsRef, show }: ThumbnailsProps) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const currentPage = usePDFSlickStore((s) => s.pageNumber);
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const [cols, setCols] = useState(1);

  useEffect(() => {
    setCols(Math.round(width / 230));
  }, [width]);

  return (
    <div
      className={clsx("overflow-auto absolute inset-0", { invisible: !show })}
      ref={(el) => {
        ref(el!);
      }}
    >
      <div className="px-2 relative h-full">
        <PDFSlickThumbnails
          {...{ thumbsRef, usePDFSlickStore }}
          className={clsx("grid gap-2 mx-auto pb-4", {
            "grid-cols-1": cols === 1,
            "grid-cols-2": cols === 2,
            "grid-cols-3": cols === 3,
            "grid-cols-4": cols > 3,
          })}
        >
          {({ pageNumber, width, height, src, pageLabel, loaded }) => (
            <div className="box-border pt-4 h-full w-full inline-flex justify-center">
              <div>
                <div className="flex justify-center">
                  <button
                    onClick={() => pdfSlick?.gotoPage(pageNumber)}
                    className={clsx(
                      "p-0.5",
                      {
                        "bg-blue-400 shadow":
                          loaded && pageNumber === currentPage,
                      },
                      { "bg-transparent": pageNumber !== currentPage },
                      { "bg-transparent": !loaded }
                    )}
                  >
                    <div
                      className={clsx("box-border relative border", {
                        "border-slate-300 border-solid bg-slate-400 bg-opacity-5 shadow-sm":
                          !loaded,
                        "border-slate-300 border-solid hover:border-blue-400 shadow hover:shadow":
                          loaded && pageNumber !== currentPage,
                        "border-transparent border-solid shadow-md":
                          loaded && pageNumber === currentPage,
                      })}
                      style={{
                        width: `${width + 2}px`,
                        height: `${height + 2}px`,
                      }}
                    >
                      {src && <img src={src} width={width} height={height} />}
                    </div>
                  </button>
                </div>
                <div className="text-center text-xs text-slate-500 py-2">
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
