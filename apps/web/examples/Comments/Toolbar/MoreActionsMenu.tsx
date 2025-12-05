import {
  ChangeEvent,
  Fragment,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  VscKebabVertical,
  VscRefresh,
  VscFilePdf,
  VscExtensions,
  VscFiles,
  VscFile,
  VscCopy,
  VscArrowBoth,
  VscCheck,
  VscInfo,
  VscDesktopDownload,
  VscDiffAdded,
  VscExport,
  VscPlay,
} from "react-icons/vsc";
import {
  ScrollMode,
  SpreadMode,
  type TUsePDFSlickStore,
} from "@pdfslick/react";
import { shallow } from "zustand/shallow";
import clsx from "clsx";
import DocumentInfoModal from "./DocumentInfoModal";

type MoreActionsMenuProps = {
  usePDFSlickStore: TUsePDFSlickStore;
};

const MoreActionsMenu = ({ usePDFSlickStore }: MoreActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const openPdfFileRef = useRef() as MutableRefObject<HTMLInputElement>;

  const {
    pdfSlick,
    pagesRotation,
    pageNumber,
    numPages,
    scrollMode,
    spreadMode,
  } = usePDFSlickStore(
    (s) => ({
      pdfSlick: s.pdfSlick,
      pagesRotation: s.pagesRotation,
      pageNumber: s.pageNumber,
      numPages: s.numPages,
      scrollMode: s.scrollMode,
      spreadMode: s.spreadMode,
    }),
    shallow
  );

  function handleOpenPdfFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      pdfSlick?.loadDocument(url, { filename: file.name });
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="absolute overflow-hidden w-0 h-0">
        <input
          id="openPdfFileAction"
          ref={openPdfFileRef}
          tabIndex={-1}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleOpenPdfFile}
          className="absolute -top-[10000px]"
        />
      </div>
      <Menu as="span" className="">
        <Menu.Button
          disabled={!pdfSlick}
          className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        >
          <span className="sr-only">Open more actions menu</span>
          <VscKebabVertical className="w-4 h-4" />
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
          <Menu.Items className="absolute right-2 w-52 z-30 mt-2 origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.requestPresentationMode()}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscPlay className="w-4 h-4" />
                    <span>Presentation Mode</span>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => openPdfFileRef.current.click()}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscDiffAdded className="w-4 h-4" />
                    <span>Open PDF File...</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.downloadOrSave()}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscDesktopDownload className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.triggerPrinting()}
                    className={clsx(
                      "w-full items-center flex space-x-1.5 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-5 h-5 fill-current -ml-0.5"
                    >
                      <path
                        d="M5 4.5C5 3.67 5.67 3 6.5 3h7c.83 0 1.5.67 1.5 1.5V5h.5A2.5 2.5 0 0118 7.5v5c0 .83-.67 1.5-1.5 1.5H15v1.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 015 15.5V14H3.5A1.5 1.5 0 012 12.5v-5A2.5 2.5 0 014.5 5H5v-.5zM6 5h8v-.5a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5V5zm-1 8v-1.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V13h1.5a.5.5 0 00.5-.5v-5c0-.83-.67-1.5-1.5-1.5h-11C3.67 6 3 6.67 3 7.5v5c0 .28.22.5.5.5H5zm1.5-2a.5.5 0 00-.5.5v4c0 .28.22.5.5.5h7a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5h-7z"
                        fillRule="nonzero"
                      />
                    </svg>
                    <span>Print</span>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => pdfSlick?.gotoPage(1)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscExport className="w-4 h-4 -rotate-90" />
                    <span>Go to First Page</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === numPages}
                    onClick={() => pdfSlick?.gotoPage(numPages)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscExport className="w-4 h-4 rotate-90" />
                    <span>Go to Last Page</span>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      pdfSlick?.setRotation(pagesRotation + 90);
                    }}
                    className={clsx(
                      "w-full flex space-x-2 box-border text-left px-2 py-1.5 text-xs",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscRefresh className="w-4 h-4" />
                    <span>Rotate Clockwise</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      pdfSlick?.setRotation(pagesRotation - 90);
                    }}
                    className={clsx(
                      "w-full flex space-x-2 box-border text-left px-2 py-1.5 text-xs",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscRefresh className="w-4 h-4 -scale-x-100 scale-y-100" />
                    <span>Rotate Counterclockwise</span>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setScrollMode(ScrollMode.PAGE)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscFilePdf className="w-4 h-4" />
                    <span className="flex-1">Page Scrolling</span>
                    {scrollMode === ScrollMode.PAGE && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setScrollMode(ScrollMode.VERTICAL)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscArrowBoth className="w-4 h-4 rotate-90" />
                    <span className="flex-1">Vertical Scrolling</span>
                    {scrollMode === ScrollMode.VERTICAL && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      pdfSlick?.setScrollMode(ScrollMode.HORIZONTAL)
                    }
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscArrowBoth className="w-4 h-4" />
                    <span className="flex-1">Horizontal Scrolling</span>
                    {scrollMode === ScrollMode.HORIZONTAL && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setScrollMode(ScrollMode.WRAPPED)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscExtensions className="w-4 h-4" />
                    <span className="flex-1">Wrapped Scrolling</span>
                    {scrollMode === ScrollMode.WRAPPED && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setSpreadMode(SpreadMode.NONE)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscFile className="w-4 h-4" />
                    <span className="flex-1">No Spreads</span>
                    {spreadMode === SpreadMode.NONE && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setSpreadMode(SpreadMode.ODD)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscFiles className="w-4 h-4" />
                    <span className="flex-1">Odd Spreads</span>
                    {spreadMode === SpreadMode.ODD && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setSpreadMode(SpreadMode.EVEN)}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscCopy className="w-4 h-4" />
                    <span className="flex-1">Even Spreads</span>
                    {spreadMode === SpreadMode.EVEN && (
                      <VscCheck className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === numPages}
                    onClick={() => openModal()}
                    className={clsx(
                      "w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50",
                      {
                        "bg-slate-100 text-gray-900": active,
                        "text-gray-700": !active,
                      }
                    )}
                  >
                    <VscInfo className="w-4 h-4" />
                    <span>Document Properties...</span>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <DocumentInfoModal {...{ usePDFSlickStore, isOpen, closeModal }} />
    </>
  );
};

export default MoreActionsMenu;
