import { onMount, type Accessor, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { type PDFSlickState } from "@pdfslick/solid";

function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

type DocumentInfoModalProps = {
  store: PDFSlickState;
  isOpen: Accessor<boolean>;
  closeModal: () => void;
};

export default function DocumentInfoModal(props: DocumentInfoModalProps) {
  let ref!: HTMLDivElement;
  let wrapperRef!: HTMLDivElement;

  const handleClick = (event: MouseEvent) => {
    if (wrapperRef.contains(event.target as HTMLElement) && !ref.contains(event.target as HTMLElement)) {
      props.closeModal()
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClick);
  });
  return (
    <Portal>
      <div
        ref={wrapperRef}
        class="relative"
        classList={{
          "opacity-0 invisible z-0 delay-300": !props.isOpen(),
          "opacity-100 visible z-10 delay-0 duration-0": props.isOpen(),
        }}
      >
        <div
          class="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-5"
          classList={{
            "ease-out duration-300 opacity-100": props.isOpen(),
            "ease-in duration-200 opacity-0": !props.isOpen(),
          }}
          onClick={() => props.closeModal()}
        />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div
              ref={ref}
              class="w-full max-w-lg transform overflow-hidden rounded-sm border border-slate-300 bg-white py-6 text-left align-middle shadow-sm transition-all"
              classList={{
                "ease-out duration-300 opacity-100 scale-100": props.isOpen(),
                "ease-in duration-200 opacity-0 scale-95": !props.isOpen(),
              }}
            >
              <h3 class="text-lg font-medium leading-6 text-gray-900 px-6 pb-4">
                Document Properties
              </h3>
              <dl class="">
                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">File name</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.filename ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">File size</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.filesize ? (
                      formatBytes(props.store.filesize, 2)
                    ) : (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Title</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.title ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Author</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.author ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Subject</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.subject ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Keywords</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.keywords ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">
                    Creation Date
                  </dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.creationDate ? (
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "long",
                        timeStyle: "medium",
                      }).format(props.store.creationDate)
                    ) : (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">
                    Modification Date
                  </dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.modificationDate ? (
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "long",
                        timeStyle: "medium",
                      }).format(props.store.modificationDate)
                    ) : (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Creator</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.creator ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">
                    PDF Producer
                  </dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.producer ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">PDF Version</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.version ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Page Count</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.numPages ?? (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">Page Size</dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.pageSize ? (
                      <>
                        {props.store.pageSize.width} x{" "}
                        {props.store.pageSize.height}{" "}
                        {props.store.pageSize.unit} (
                        {props.store.pageSize.name
                          ? props.store.pageSize.name + ", "
                          : ""}
                        {props.store.pageSize.orientation})
                      </>
                    ) : (
                      <span class="text-xs text-gray-500">N/A</span>
                    )}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                  <dt class="text-sm font-medium text-gray-500">
                    Fast Web View
                  </dt>
                  <dd class="text-sm text-gray-900 col-span-2">
                    {props.store.isLinearized ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>

              <div class="mt-4 px-6 flex justify-center">
                <button
                  type="button"
                  class="inline-flex justify-center rounded border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={props.closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
