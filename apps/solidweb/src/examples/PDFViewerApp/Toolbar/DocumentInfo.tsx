import { VsInfo } from "solid-icons/vs";
import { type PDFSlickState } from "@pdfslick/solid";
import DocumentInfoModal from "./DocumentInfoModal";
import { createSignal } from "solid-js";
import Tooltip from "../Tooltip";

type DocumentInfoProps = {
  store: PDFSlickState;
};

export default function DocumentInfo(props: DocumentInfoProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        onClick={() => {
          openModal();
        }}
      >
        <VsInfo class="w-4 h-4" />
        <Tooltip position="bottom" alignX="right">
          <p class="whitespace-nowrap">Document Properties</p>
        </Tooltip>
      </button>

      <DocumentInfoModal {...{ store: props.store, isOpen, closeModal }} />
    </>
  );
}
