import {
  createEffect,
  createSignal,
  type Accessor,
  type JSX,
  onCleanup,
} from "solid-js";
import {
  VsChevronDown,
  VsChevronUp,
  VsLayoutSidebarLeft,
  VsLayoutSidebarLeftOff,
  VsDiffAdded,
  VsDesktopDownload,
} from "solid-icons/vs";
import ZoomSelector from "./ZoomSelector";
import InkMenu from "./InkMenu";
import FreetextMenu from "./FreetextMenu";
import Splitter from "./Splitter";

import { type PDFSlickState } from "@pdfslick/solid";
import DocumentInfo from "./DocumentInfo";
import MoreActionsMenu from "./MoreActionsMenu";
import Tooltip from "../Tooltip";

type TToolbarProps = {
  store: PDFSlickState;
  isThumbsbarOpen: Accessor<boolean>;
  setIsThumbsbarOpen: (s: boolean) => void;
};

const Toolbar = ({
  store,
  isThumbsbarOpen,
  setIsThumbsbarOpen,
}: TToolbarProps) => {
  let pageNumberRef!: HTMLInputElement;
  let openPdfFileRef!: HTMLInputElement;

  const [wantedPageNumber, setWantedPageNumber] = createSignal<number | string>(
    1
  );

  const handleOpenPdfFile: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      store.pdfSlick?.loadDocument(url, { filename: file.name });
    }
  };

  const updatePageNumber = ({ pageNumber }: any) =>
    setWantedPageNumber(pageNumber);

  createEffect(() => {
    if (store.pdfSlick) {
      store.pdfSlick?.on("pagechanging", updatePageNumber);
    }
  });

  onCleanup(() => {
    store.pdfSlick?.off("pagechanging", updatePageNumber);
  });

  return (
    <>
      <div
        class={`w-full h-9 flex items-center justify-between bg-slate-50 border-b border-b-slate-300 shadow-sm text-xs select-none sticky top-0 bg-opacity-100 backdrop-blur z-10`}
      >
        <div class="px-1 flex items-center space-x-1">
          <button
            class={`enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent`}
            onClick={() => setIsThumbsbarOpen(!isThumbsbarOpen())}
          >
            {isThumbsbarOpen() ? (
              <VsLayoutSidebarLeftOff class="h-4 w-4" />
            ) : (
              <VsLayoutSidebarLeft class="h-4 w-4" />
            )}
          </button>

          <Splitter />

          <ZoomSelector {...{ store }} />

          <Splitter />

          <button
            disabled={store.pageNumber <= 1}
            class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
            onClick={() => store.pdfSlick?.viewer?.previousPage()}
          >
            <VsChevronUp class="h-4 w-4" />
          </button>

          <button
            disabled={!store.pdfSlick || store.pageNumber >= store.numPages}
            class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
            onClick={() => store.pdfSlick?.viewer?.nextPage()}
          >
            <VsChevronDown class="h-4 w-4" />
          </button>

          <div class="flex items-center text-center space-x-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newPageNumber = parseInt(wantedPageNumber + "");
                if (
                  Number.isInteger(newPageNumber) &&
                  newPageNumber > 0 &&
                  newPageNumber <= store.numPages
                ) {
                  store.pdfSlick?.linkService.goToPage(newPageNumber);
                } else {
                  setWantedPageNumber(store.pageNumber);
                }
              }}
            >
              <input
                ref={pageNumberRef}
                type="text"
                value={wantedPageNumber()}
                class="block w-12 text-right rounded-sm border border-slate-300 focus:shadow focus:border-blue-400 focus:ring-0 outline-none text-xs p-1 px-1.5 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
                onFocus={() => pageNumberRef!.select()}
                onChange={(e) => {
                  setWantedPageNumber(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "Down":
                    case "ArrowDown":
                      store.pdfSlick?.gotoPage(
                        Math.max(1, (store.pageNumber ?? 0) - 1)
                      );
                      break;
                    case "Up":
                    case "ArrowUp":
                      store.pdfSlick?.gotoPage(
                        Math.min(
                          store.numPages ?? 0,
                          (store.pageNumber ?? 0) + 1
                        )
                      );
                      break;
                    default:
                      return;
                  }
                }}
              />
            </form>

            <span> of {store.numPages}</span>
          </div>
        </div>

        <div class="px-1 space-x-1 flex items-center justify-end">
          <FreetextMenu {...{ store }} />
          <InkMenu {...{ store }} />

          <Splitter />

          <div class="items-center space-x-1 hidden sm:flex">
            <button
              class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
              onClick={() => openPdfFileRef.click()}
            >
              <VsDiffAdded class="w-4 h-4" />
              <Tooltip position="bottom">
                <p class="whitespace-nowrap">Open PDF File</p>
              </Tooltip>
            </button>

            <button
              class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
              onClick={() => store.pdfSlick?.downloadOrSave()}
            >
              <VsDesktopDownload class="w-4 h-4" />
              <Tooltip position="bottom">
                <p class="whitespace-nowrap">Save</p>
              </Tooltip>
            </button>

            <DocumentInfo {...{ store }} />
            <Splitter />
          </div>

          <MoreActionsMenu {...{ store }} />
        </div>
      </div>
      <div class="absolute -top-10 overflow-hidden w-0 h-0">
        <input
          id="openPdfFile"
          ref={openPdfFileRef}
          tabIndex={-1}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleOpenPdfFile}
          class="absolute -top-[10000px]"
        />
      </div>
    </>
  );
};

export default Toolbar;
