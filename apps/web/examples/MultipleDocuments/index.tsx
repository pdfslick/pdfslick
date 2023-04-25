import { ChangeEvent, MutableRefObject, useRef, useState } from "react";
import clsx from "clsx";
import { VscAdd } from "react-icons/vsc";
import { type PDFSlickState } from "@pdfslick/react";
import Document from "./Document";
import Sidebar from "./Sidebar";
import { pdfDocs } from "../../components/pdfDocs";

import "@pdfslick/react/dist/pdf_viewer.css";

export function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function MultipleDocuments() {
  const [docs, setDocs] = useState<{ url: string; name: string }[]>(
    Object.keys(pdfDocs).map((key) => pdfDocs[key])
  );
  const [doc, setDoc] = useState<Partial<PDFSlickState> | null>(null);

  const openPdfFileRef = useRef() as MutableRefObject<HTMLInputElement>;
  const handleOpenPdfFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const name = file.name;
      setDocs([...docs, { url, name }]);
      setDoc({ url, filename: name });
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-100/70 flex flex-col pdfSlick">
      <div className="flex-1 flex items-start w-full">
        <div className="flex-1 relative h-full">
          <div className="overflow-y-auto absolute inset-0 p-8">
            <ul
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
            >
              {docs.map(({ url, name }, ix) => (
                <li key={url} className="relative">
                  <Document
                    {...{
                      url,
                      name,
                      setDoc,
                      isSelected: doc?.url === url,
                      setInitial: ix === 0,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="hidden w-96 h-full relative border-l border-slate-300 bg-white shadow-sm sm:flex flex-col">
          {doc && <Sidebar url={`${doc.url}`} filename={doc.filename} />}
        </aside>

        <div
          className={clsx(
            "absolute bottom-4 left-8 p-2 rounded-full group inline-flex items-center group space-x-2 text-xs",
            "hover:bg-slate-100/70 hover:backdrop-blur-sm"
          )}
        >
          <button
            onClick={() => openPdfFileRef.current.click()}
            type="button"
            className="rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <VscAdd className="h-5 w-5" />
            <span className="sr-only">Add file</span>
          </button>
          <div
            className={clsx(
              "text-slate-600 pointer-events-none",
              "pr-2 hidden group-hover:block"
            )}
          >
            Upload PDF File
          </div>

          <div className="absolute overflow-hidden w-0 h-0">
            <input
              id="openPdfFileAction"
              ref={openPdfFileRef}
              tabIndex={-1}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleOpenPdfFile}
              className="absolute -top-[10000px] -left-[10000px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
