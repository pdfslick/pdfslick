import clsx from "clsx";
import { type TUsePDFSlickStore, PDFSlickThumbnails } from "@pdfslick/react";

type ThumbnailsProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  thumbsRef: (instance: HTMLElement | null) => void;
};

const Thumbnails = ({ usePDFSlickStore, thumbsRef }: ThumbnailsProps) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const currentPage = usePDFSlickStore((s) => s.pageNumber);

  return (
    <div
      className={clsx(
        "overflow-auto w-full h-44 bg-slate-50 z-10 border-t border-slate-300 [box-shadow:1px_0_3px_0_rgb(0_0_0_/_0.1)]"
      )}
    >
      <div className="px-2 relative whitespace-nowrap h-full">
        <PDFSlickThumbnails
          {...{ thumbsRef, usePDFSlickStore }}
          className={clsx(
            "px-2 relative whitespace-nowrap h-full flex items-center space-x-2"
          )}
        >
          {({ pageNumber, width, height, src, pageLabel, loaded }) => (
            <div className="box-border pt-4 w-full inline-flex justify-center">
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
                        "border-slate-300 border-solid bg-slate-400/5 shadow-sm":
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
