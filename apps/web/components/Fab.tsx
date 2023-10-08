import {
  VscChevronUp,
  VscDiffAdded,
  VscInfo,
  VscExtensions,
  VscBlank,
  VscIndent,
  VscGist,
} from "react-icons/vsc";
import Logo from "./Logo";
import { Menu, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, MutableRefObject, useRef } from "react";
import clsx from "clsx";
import { pdfDocsList } from "./pdfDocs";
import Link from "next/link";
import { useRouter } from "next/router";

type FabProps = {
  pdfSwitchable?: boolean;
};

export default function Fab({ pdfSwitchable = true }: FabProps) {
  const router = useRouter();
  const openPdfFileRef = useRef() as MutableRefObject<HTMLInputElement>;

  function handleOpenPdfFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      router.push(`${router.pathname}?pdf=${url}`);
    }
  }

  return (
    <>
      <div className="absolute overflow-hidden w-0 h-0">
        <input
          id="openPdfFileActionFab"
          ref={openPdfFileRef}
          tabIndex={-1}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleOpenPdfFile}
          className="absolute -top-[10000px]"
        />
      </div>
      <div className="absolute flex space-x-2 items-center bottom-2 right-3 transition-opacity z-20 bg-slate-100 bg-opacity-0 backdrop-blur-sm border border-slate-300 shadow-sm rounded px-2 py-1">
        <Logo className="h-3" />
        <Menu as="div" className="text-sm flex relative">
          <Menu.Button className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent">
            <span className="sr-only">Open PDFSlick menu</span>
            <VscChevronUp className="w-4 h-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -right-2 bottom-9 w-64 z-30 origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {pdfSwitchable && (
                <div className="py-1">
                  <div
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-sm text-gray-700"
                    )}
                  >
                    <VscGist className="w-4 h-4 shrink-0" />
                    <span className="block text-gray-900">
                      Switch between PDFs
                    </span>
                  </div>
                  {pdfDocsList.map((doc) => (
                    <Menu.Item key={doc.title}>
                      {({ active }) => (
                        <a
                          href={`${router.pathname}?pdf=${doc.url}`}
                          title={doc.title}
                          className={clsx(
                            "w-full items-top flex space-x-2 box-border text-left px-2 py-1.5 text-sm disabled:opacity-50",
                            {
                              "bg-slate-100 text-gray-900": active,
                              "text-gray-700": !active,
                            }
                          )}
                        >
                          <VscIndent className="w-4 h-4 shrink-0" />
                          <span className="truncate block">{doc.title}</span>
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              )}

              {pdfSwitchable && (
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => openPdfFileRef.current.click()}
                        className={clsx(
                          "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-sm disabled:opacity-50",
                          {
                            "bg-slate-100 text-gray-900": active,
                            "text-gray-700": !active,
                          }
                        )}
                      >
                        <VscDiffAdded className="w-4 h-4" />
                        <span>Open your PDF File...</span>
                      </button>
                    )}
                  </Menu.Item>
                  <div
                    className="px-2 py-0.5 truncate text-gray-400 text-xs cursor-default"
                    title={
                      "your files open directly in browser, they don't touch our servers at all"
                    }
                  >
                    {
                      "* your files open directly in browser, they don't touch our servers at all"
                    }
                  </div>
                </div>
              )}

              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/examples"
                      className={clsx(
                        "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-sm disabled:opacity-50",
                        {
                          "bg-slate-100 text-gray-900": active,
                          "text-gray-700": !active,
                        }
                      )}
                    >
                      <VscExtensions className="w-4 h-4" />
                      <span>Back to examples...</span>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
