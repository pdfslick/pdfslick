import { createSignal, type JSX } from "solid-js";
import { DropdownMenu } from "@kobalte/core";
import {
  VsKebabVertical,
  VsRefresh,
  VsFilePdf,
  VsExtensions,
  VsFiles,
  VsFile,
  VsCopy,
  VsArrowBoth,
  VsCheck,
  VsInfo,
  VsDesktopDownload,
  VsDiffAdded,
  VsExport,
  VsPlay,
} from "solid-icons/vs";
import { ScrollMode, SpreadMode, type PDFSlickState } from "@pdfslick/solid";
import DocumentInfoModal from "./DocumentInfoModal";

type MoreActionsMenuProps = {
  store: PDFSlickState;
};

const MoreActionsMenu = ({ store }: MoreActionsMenuProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let openPdfFileRef!: HTMLInputElement;

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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div class="absolute overflow-hidden w-0 h-0">
        <input
          id="openPdfFileAction"
          ref={openPdfFileRef}
          tabIndex={-1}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleOpenPdfFile}
          class="absolute -top-[10000px]"
        />
      </div>
      <DropdownMenu.Root isModal={false}>
        <DropdownMenu.Trigger
          class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span class="sr-only">Open more actions menu</span>
          <VsKebabVertical class="w-4 h-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="absolute right-2 w-52 z-30 mt-2 origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-content-hide ui-expanded:animate-content-show"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
          >
            <div class="py-1">
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.requestPresentationMode();
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsPlay class="w-4 h-4" />
                <span>Presentation Mode</span>
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                onSelect={() => {
                  openPdfFileRef.click();
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsDiffAdded class="w-4 h-4" />
                <span>Open PDF File...</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.downloadOrSave();
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsDesktopDownload class="w-4 h-4" />
                <span>Save</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.triggerPrinting();
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <svg viewBox="0 0 20 20" class="w-5 h-5 fill-current -ml-0.5">
                  <path
                    d="M5 4.5C5 3.67 5.67 3 6.5 3h7c.83 0 1.5.67 1.5 1.5V5h.5A2.5 2.5 0 0118 7.5v5c0 .83-.67 1.5-1.5 1.5H15v1.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 015 15.5V14H3.5A1.5 1.5 0 012 12.5v-5A2.5 2.5 0 014.5 5H5v-.5zM6 5h8v-.5a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5V5zm-1 8v-1.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V13h1.5a.5.5 0 00.5-.5v-5c0-.83-.67-1.5-1.5-1.5h-11C3.67 6 3 6.67 3 7.5v5c0 .28.22.5.5.5H5zm1.5-2a.5.5 0 00-.5.5v4c0 .28.22.5.5.5h7a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5h-7z"
                    fill-rule="nonzero"
                  />
                </svg>
                <span>Print</span>
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                isDisabled={store.pageNumber === 1}
                onSelect={() => {
                  store.pdfSlick?.gotoPage(1);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsExport class="w-4 h-4 -rotate-90" />
                <span>Go to First Page</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                isDisabled={store.pageNumber === store.numPages}
                onSelect={() => {
                  store.pdfSlick?.gotoPage(store.numPages);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsExport class="w-4 h-4 rotate-90" />
                <span>Go to Last Page</span>
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                closeOnSelect={false}
                onSelect={() => {
                  store.pdfSlick?.setRotation(store.pagesRotation + 90);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsRefresh class="w-4 h-4" />
                <span>Rotate Clockwise</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                closeOnSelect={false}
                onSelect={() => {
                  store.pdfSlick?.setRotation(store.pagesRotation - 90);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsRefresh class="w-4 h-4 -scale-x-100 scale-y-100" />
                <span>Rotate Counterclockwise</span>
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setScrollMode(ScrollMode.PAGE);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsFilePdf class="w-4 h-4" />
                <span class="flex-1">Page Scrolling</span>
                {store.scrollMode === ScrollMode.PAGE && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setScrollMode(ScrollMode.VERTICAL);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsArrowBoth class="w-4 h-4 rotate-90" />
                <span class="flex-1">Vertical Scrolling</span>
                {store.scrollMode === ScrollMode.VERTICAL && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setScrollMode(ScrollMode.HORIZONTAL);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsArrowBoth class="w-4 h-4" />
                <span class="flex-1">Horizontal Scrolling</span>
                {store.scrollMode === ScrollMode.HORIZONTAL && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setScrollMode(ScrollMode.WRAPPED);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsExtensions class="w-4 h-4" />
                <span class="flex-1">Wrapped Scrolling</span>
                {store.scrollMode === ScrollMode.WRAPPED && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setSpreadMode(SpreadMode.NONE);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsFile class="w-4 h-4" />
                <span class="flex-1">No Spreads</span>
                {store.spreadMode === SpreadMode.NONE && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setSpreadMode(SpreadMode.ODD);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsFiles class="w-4 h-4" />
                <span class="flex-1">Odd Spreads</span>
                {store.spreadMode === SpreadMode.ODD && <VsCheck class="w-3" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  store.pdfSlick?.setSpreadMode(SpreadMode.EVEN);
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsCopy class="w-4 h-4" />
                <span class="flex-1">Even Spreads</span>
                {store.spreadMode === SpreadMode.EVEN && (
                  <VsCheck class="w-3" />
                )}
              </DropdownMenu.Item>
            </div>

            <div class="py-1">
              <DropdownMenu.Item
                onSelect={() => {
                  openModal();
                }}
                class="w-full ui-disabled:cursor-default ui-not-disabled:cursor-pointer items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs ui-disabled:opacity-50 ui-highlighted:bg-slate-100 ui-highlighted:text-gray-900 ui-not-highlighted:text-gray-700"
              >
                <VsInfo class="w-4 h-4" />
                <span>Document Properties...</span>
              </DropdownMenu.Item>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <DocumentInfoModal {...{ store, isOpen, closeModal }} />
    </>
  );
};

export default MoreActionsMenu;
