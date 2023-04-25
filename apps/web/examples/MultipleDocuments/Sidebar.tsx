import { shallow } from "zustand/shallow";
import { usePDFSlick } from "@pdfslick/react";
import {
  VscCloudDownload,
  VscChevronLeft,
  VscChevronRight,
} from "react-icons/vsc";
import { formatBytes } from "./";

type SidebarProps = {
  url: string;
  filename?: string;
};

export default function Sidebar({ url, filename }: SidebarProps) {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(url, {
    scaleValue: "page-width",
    singlePageViewer: true,
    textLayerMode: 0,
    annotationEditorMode: 0,
    ...(filename && { filename }),
  });

  const doc = usePDFSlickStore(
    (s) => ({
      filesize: s.filesize,
      filename: s.filename,
      title: s.title,
      subject: s.subject,
      creator: s.creator,
      keywords: s.keywords,
      creationDate: s.creationDate,
      modificationDate: s.modificationDate,
      author: s.author,
      producer: s.producer,
      version: s.version,
      numPages: s.numPages,
      pageSize: s.pageSize,
      isLinearized: s.isLinearized,
      pdfSlick: s.pdfSlick,
      pageNumber: s.pageNumber,
    }),
    shallow
  );

  const info: Record<string, any> = {
    Title: doc.title ?? <span className="text-xs text-gray-500">N/A</span>,
    Subject: doc.subject ?? <span className="text-xs text-gray-500">N/A</span>,
    Creator: doc.creator ?? <span className="text-xs text-gray-500">N/A</span>,
    Keywords: doc.keywords ?? (
      <span className="text-xs text-gray-500">N/A</span>
    ),
    "Created at": doc.creationDate ? (
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(doc.creationDate)
    ) : (
      <span className="text-xs text-gray-500">N/A</span>
    ),
    "Modified at": doc.modificationDate ? (
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(doc.modificationDate)
    ) : (
      <span className="text-xs text-gray-500">N/A</span>
    ),
    Author: doc.author ?? <span className="text-xs text-gray-500">N/A</span>,
    Producer: doc.producer ?? (
      <span className="text-xs text-gray-500">N/A</span>
    ),
    Version: doc.version ?? <span className="text-xs text-gray-500">N/A</span>,
    Pages: doc.numPages,
    "Page Size": doc.pageSize ? (
      `${doc.pageSize.width} x ${doc.pageSize.height} ${doc.pageSize.unit} (${
        doc.pageSize.name ? doc.pageSize.name + ", " : ""
      } ${doc.pageSize.orientation})`
    ) : (
      <span className="text-xs text-gray-500">N/A</span>
    ),
    "Fast Web View": doc.isLinearized ? "Yes" : "No",
  };

  return (
    <>
      <div className="flex-1 relative">
        <div className="overflow-y-auto absolute inset-0 p-6">
          <div className="space-y-6">
            <div>
              <div className="aspect-h-14 aspect-w-10 block w-full overflow-hidden rounded-lg group">
                <div className="w-[calc(100%+80px)] absolute left-1/2 -translate-x-1/2">
                  <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
                </div>
                <div className="absolute inset-0">
                  <div className="absolute bottom-2 left-0 w-full flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <button
                      disabled={doc.pageNumber <= 1}
                      onClick={() => doc.pdfSlick?.gotoPage(doc.pageNumber - 1)}
                      type="button"
                      className="rounded-full bg-blue-600 p-1.5 text-white enabled:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 opacity-50 enabled:hover:opacity-100 disabled:opacity-30 enabled:ring-2 enabled:ring-blue-500 enabled:ring-offset-2"
                    >
                      <VscChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Page</span>
                    </button>

                    <button
                      disabled={doc.pageNumber >= doc.numPages}
                      onClick={() => doc.pdfSlick?.gotoPage(doc.pageNumber + 1)}
                      type="button"
                      className="rounded-full bg-blue-600 p-1.5 text-white enabled:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 opacity-50 enabled:hover:opacity-100 disabled:opacity-30 enabled:ring-2 enabled:ring-blue-500 enabled:ring-offset-2"
                    >
                      <VscChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg w-full flex-1 font-medium text-gray-900">
                    <span className="sr-only">Details for </span>
                    {doc.filename?.split("").join("​")}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {formatBytes(doc.filesize ?? 0, 1)}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Information</h3>
              <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                {Object.keys(info).map((key) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 text-sm font-medium"
                  >
                    <dt className="text-gray-500 w-28">{key}</dt>
                    <dd
                      className="whitespace-nowrap flex-1 truncate text-gray-900"
                      title={info[key]}
                    >
                      {info[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-3 px-8 py-2 bg-slate-50 z-10 border-t border-slate-300 [box-shadow:1px_0_3px_0_rgb(0_0_0_/_0.1)]">
        <button
          onClick={() => doc.pdfSlick?.downloadOrSave()}
          type="button"
          className="group flex items-center rounded-md bg-transparent hover:bg-slate-100 p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 space-x-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 group-hover:text-slate-600 group-hover:border-slate-400">
            <VscCloudDownload className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            Download
          </span>
        </button>
      </div>
    </>
  );
}
