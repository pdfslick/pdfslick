import clsx from "clsx";
import {
  VscChevronRight,
  VscChevronLeft,
  VscZoomIn,
  VscZoomOut,
} from "react-icons/vsc";
import type { TUsePDFSlickStore } from "@pdfslick/react";

type PDFNavigationProps = {
  usePDFSlickStore: TUsePDFSlickStore;
};

export default function PDFNavigation({
  usePDFSlickStore,
}: PDFNavigationProps) {
  const pageNumber = usePDFSlickStore((s) => s.pageNumber);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const scale = usePDFSlickStore((s) => s.scale);
  return (
    <div className="fixed w-full h-12 bottom-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-center">
        <div
          className={clsx(
            "inline-flex rounded shadow justify-center border border-slate-300",
            "bg-white",
            "divide-x divide-x-slate-100"
          )}
        >
          <button
            disabled={pageNumber === 1}
            onClick={() => pdfSlick?.gotoPage(pageNumber - 1)}
            type="button"
            className="relative inline-flex items-center rounded-l px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 disabled:opacity-70 pointer-events-auto"
          >
            <span className="sr-only">Previous</span>
            <VscChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            disabled={!pdfSlick || scale <= 0.25}
            onClick={() => pdfSlick?.viewer?.decreaseScale()}
            type="button"
            className="relative inline-flex items-center px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 pointer-events-auto disabled:opacity-70"
          >
            <span className="sr-only">Zoom Out</span>
            <VscZoomOut className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            disabled={!pdfSlick || scale >= 5}
            onClick={() => pdfSlick?.viewer?.increaseScale()}
            type="button"
            className="relative inline-flex items-center px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 pointer-events-auto disabled:opacity-70"
          >
            <span className="sr-only">Zoom In</span>
            <VscZoomIn className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            disabled={numPages <= pageNumber}
            onClick={() => pdfSlick?.gotoPage(pageNumber + 1)}
            type="button"
            className="relative inline-flex items-center rounded-r px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 disabled:opacity-70 pointer-events-auto"
          >
            <span className="sr-only">Next</span>
            <VscChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
