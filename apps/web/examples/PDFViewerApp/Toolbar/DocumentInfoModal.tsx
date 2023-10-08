import { Dialog, Transition } from "@headlessui/react";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { Fragment } from "react";

function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

type DocumentInfoModalProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  isOpen: boolean;
  closeModal: () => void;
};

export default function DocumentInfoModal({
  usePDFSlickStore,
  isOpen,
  closeModal,
}: DocumentInfoModalProps) {
  const filename = usePDFSlickStore((s) => s.filename);
  const filesize = usePDFSlickStore((s) => s.filesize);
  const title = usePDFSlickStore((s) => s.title);
  const subject = usePDFSlickStore((s) => s.subject);
  const creator = usePDFSlickStore((s) => s.creator);
  const keywords = usePDFSlickStore((s) => s.keywords);
  const creationDate = usePDFSlickStore((s) => s.creationDate);
  const modificationDate = usePDFSlickStore((s) => s.modificationDate);
  const author = usePDFSlickStore((s) => s.author);
  const producer = usePDFSlickStore((s) => s.producer);
  const version = usePDFSlickStore((s) => s.version);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const pageSize = usePDFSlickStore((s) => s.pageSize);
  const isLinearized = usePDFSlickStore((s) => s.isLinearized);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-5" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-sm border border-slate-300 bg-white py-6 text-left align-middle shadow-sm transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 px-6 pb-4"
                >
                  Document Properties
                </Dialog.Title>
                <dl className="">
                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      File name
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {filename ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      File size
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {filesize ? (
                        formatBytes(filesize, 2)
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {title ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Author
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {author ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Subject
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {subject ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Keywords
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {keywords ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Creation Date
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {creationDate ? (
                        new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                          timeStyle: "medium",
                        }).format(creationDate)
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Modification Date
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {modificationDate ? (
                        new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                          timeStyle: "medium",
                        }).format(modificationDate)
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Creator
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {creator ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      PDF Producer
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {producer ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      PDF Version
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {version ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Page Count
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {numPages ?? (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Page Size
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {pageSize ? (
                        <>
                          {pageSize.width} x {pageSize.height} {pageSize.unit} (
                          {pageSize.name ? pageSize.name + ", " : ""}
                          {pageSize.orientation})
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5 hover:bg-slate-50">
                    <dt className="text-sm font-medium text-gray-500">
                      Fast Web View
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {isLinearized ? "Yes" : "No"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 px-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
