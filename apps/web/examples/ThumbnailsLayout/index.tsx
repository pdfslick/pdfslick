import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  VscChevronRight,
  VscChevronLeft,
  VscChromeClose,
} from "react-icons/vsc";
import { usePDFSlick } from "@pdfslick/react";

type ThumbnailsLayoutProps = {
  pdfFilePath: string;
};

const ThumbnailsLayout = ({ pdfFilePath }: ThumbnailsLayoutProps) => {
  const {
    viewerRef,
    thumbsRef,
    usePDFSlickStore,
    PDFSlickViewer,
    PDFSlickThumbnails,
  } = usePDFSlick(pdfFilePath, {
    thumbnailWidth: 370,
    singlePageViewer: true,
    removePageBorders: true,
    scaleValue: "page-fit",
  });

  const [open, setOpen] = useState(false);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const pageNumber = usePDFSlickStore((s) => s.pageNumber);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const pagesOverview = pdfSlick?.getPagesOverview();

  const onPageOpen = (pageNumber: number) => {
    pdfSlick?.gotoPage(pageNumber);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      pdfSlick?.viewer.update();
    }
  }, [open]);

  return (
    <>
      <div className="relative bg-gray-50 w-full h-full z-10">
        <PDFSlickThumbnails
          {...{ thumbsRef, usePDFSlickStore }}
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8 p-8"
        >
          {({
            pageNumber,
            width,
            height,
            rotation,
            src,
            pageLabel,
            loaded,
          }) => (
            <div
              key={pageNumber}
              className="group p-4 bg-gray-100 rounded-sm border border-gray-200 shadow-sm"
              onClick={() => onPageOpen(pageNumber)}
            >
              <div
                className={clsx(
                  "w-full overflow-hidden rounded-sm border border-gray-200 cursor-pointer",
                  "shadow-sm group-hover:shadow-lg",
                  "scale-[.99]  group-hover:scale-100 origin-bottom",
                  "aspect-h-1 aspect-w-1 sm:aspect-h-3 sm:aspect-w-2",
                  "transition-all duration-200 ease-in-out"
                )}
              >
                {src && (
                  <img
                    src={src}
                    width={width}
                    height={height}
                    className={clsx("h-full w-full object-cover object-center")}
                  />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                <h3>{pageNumber}</h3>
                {src &&
                  pagesOverview?.at(pageNumber - 1)?.width &&
                  pagesOverview?.at(pageNumber - 1)?.height && (
                    <p className="text-sm italic text-gray-500">
                      {~~pagesOverview.at(pageNumber - 1)!.width} ×{" "}
                      {~~pagesOverview.at(pageNumber - 1)!.height}
                    </p>
                  )}
              </div>
            </div>
          )}
        </PDFSlickThumbnails>
      </div>

      <div
        className={clsx("fixed inset-0 z-20 transition-all", {
          "h-full overflow-auto delay-0 duration-0": open,
          "h-0 overflow-hidden delay-300 duration-0": !open,
        })}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-white/20 backdrop-blur-sm transition-opacity",
            {
              "opacity-100 ease-out duration-300": open,
              "opacity-0 ease-in duration-200": !open,
            }
          )}
        />
        <div
          className={clsx(
            "absolute inset-0 flex flex-col transition-opacity duration-300",
            {
              "opacity-0": !open,
              "opacity-100": open,
            }
          )}
        >
          <div className="flex-1 relative overflow-hidden">
            <PDFSlickViewer
              {...{
                viewerRef,
                usePDFSlickStore,
                className: "!overflow-hidden",
              }}
            />
          </div>

          <div className="absolute top-2 right-8">
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="bg-gray-100 shadow-sm text-gray-400 rounded-md p-1 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-0 focus:ring-orange-500"
            >
              <span className="sr-only">Close</span>
              <VscChromeClose className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 [box-shadow:1px_0_2px_0_rgb(0_0_0_/_0.1)]">
            <div className="flex flex-1 items-center justify-center">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow"
                  aria-label="Pagination"
                >
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => pdfSlick?.gotoPage(1)}
                    className="relative inline-flex items-center rounded-l-md px-2.5 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-300"
                  >
                    <span className="sr-only">First</span>
                    <VscChevronLeft
                      className="h-5 w-5 -ml-1"
                      aria-hidden="true"
                    />
                    <VscChevronLeft
                      className="h-5 w-5 absolute ml-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => pdfSlick?.gotoPage(pageNumber - 1)}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-300"
                  >
                    <span className="sr-only">Previous</span>
                    <VscChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <div className="relative w-64 inline-flex items-center justify-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300">
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{pageNumber}</span> of{" "}
                      <span className="font-medium">{numPages}</span>
                    </p>
                  </div>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => pdfSlick?.gotoPage(pageNumber + 1)}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-300"
                  >
                    <span className="sr-only">Next</span>
                    <VscChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => pdfSlick?.gotoPage(numPages)}
                    className="relative inline-flex items-center rounded-r-md px-2.5 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:text-gray-300"
                  >
                    <span className="sr-only">Last</span>
                    <VscChevronRight
                      className="h-5 w-5 -ml-1"
                      aria-hidden="true"
                    />
                    <VscChevronRight
                      className="h-5 w-5 absolute ml-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThumbnailsLayout;
