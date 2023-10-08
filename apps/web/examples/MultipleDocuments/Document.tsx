import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import clsx from "clsx";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { usePDFSlick, type PDFSlickState } from "@pdfslick/react";
import { formatBytes } from "./";

type DocumentProps = {
  url: string;
  name?: string;
  setDoc: (s: Partial<PDFSlickState>) => void;
  isSelected: boolean;
  setInitial?: boolean;
};

export default function Document({
  url,
  setDoc,
  setInitial,
  isSelected,
  name,
}: DocumentProps) {
  const { isDocumentLoaded, viewerRef, usePDFSlickStore, PDFSlickViewer } =
    usePDFSlick(url, {
      scaleValue: "page-width",
      singlePageViewer: true,
      textLayerMode: 0,
      annotationEditorMode: 0,
      ...(name && { filename: name }),
    });

  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  const doc = usePDFSlickStore(
    (s) => ({
      filesize: s.filesize,
      filename: s.filename,
      pageNumber: s.pageNumber,
      numPages: s.numPages,
      url: s.url,
    }),
    shallow
  );

  useEffect(() => {
    if (isDocumentLoaded && setInitial) {
      setDoc(doc);
    }
  }, [isDocumentLoaded]);

  return (
    <div>
      <div
        className={clsx(
          {
            "ring-2 ring-blue-500 ring-offset-2": isSelected,
          },
          "aspect-w-10 aspect-h-7 group block relative w-full overflow-hidden rounded-lg bg-slate-200"
        )}
      >
        <div className="w-[calc(100%+80px)] absolute left-1/2 -translate-x-1/2">
          <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
        </div>
        <div
          onClick={() => setDoc(doc)}
          className="bg-white bg-opacity-0 hover:bg-opacity-20 absolute inset-0 cursor-pointer"
        >
          <div className="absolute bottom-2 left-0 w-full flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <button
              disabled={doc.pageNumber <= 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pdfSlick?.gotoPage(doc.pageNumber - 1);
              }}
              type="button"
              className="rounded-full bg-blue-600 p-1.5 text-white enabled:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 bg-opacity-50 enabled:hover:bg-opacity-100 disabled:opacity-30 enabled:ring-2 enabled:ring-blue-500 enabled:ring-offset-2"
            >
              <VscChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </button>

            <button
              disabled={doc.pageNumber >= doc.numPages}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pdfSlick?.gotoPage(doc.pageNumber + 1);
              }}
              type="button"
              className="rounded-full bg-blue-600 p-1.5 text-white enabled:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 bg-opacity-50 enabled:hover:bg-opacity-100 disabled:opacity-30 enabled:ring-2 enabled:ring-blue-500 enabled:ring-offset-2"
            >
              <VscChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </button>
          </div>
        </div>
      </div>
      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
        {doc.filename}
      </p>
      <p className="pointer-events-none block text-sm font-medium text-gray-500">
        {formatBytes(doc.filesize ?? 0, 1)}
      </p>
    </div>
  );
}
