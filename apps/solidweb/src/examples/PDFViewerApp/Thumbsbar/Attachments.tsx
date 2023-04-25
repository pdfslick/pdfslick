import type { PDFSlickState } from "@pdfslick/solid";
import { type Component, For } from "solid-js";

type AttachmentsProps = {
  store: PDFSlickState;
  show: boolean;
};

type AttachmentButtonProps = {
  store: PDFSlickState;
  filename: string;
  content: Uint8Array;
};

const AttachmentButton: Component<AttachmentButtonProps> = (props) => {
  let ref!: HTMLButtonElement;

  return (
    <button
      ref={ref}
      class="w-full box-border rounded text-left hover:text-slate-900 p-1 hover:bg-slate-200"
      onClick={() =>
        props.store.pdfSlick?.openOrDownloadData(
          ref,
          props.content,
          props.filename
        )
      }
    >
      {props.filename}
    </button>
  );
};

const Attachments: Component<AttachmentsProps> = (props) => {
  return (
    <div
      class="overflow-auto absolute inset-0"
      classList={{ invisible: !props.show }}
    >
      <div class="p-2 text-slate-700 text-sm">
        <For each={Array.from(props.store.attachments.values())}>
          {({ filename, content }) => (
            <AttachmentButton {...{ store: props.store, filename, content }} />
          )}
        </For>
      </div>
    </div>
  );
};

export default Attachments;
