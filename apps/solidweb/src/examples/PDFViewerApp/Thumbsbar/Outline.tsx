import { Component, For } from "solid-js";
import { type PDFSlickState, type TPDFDocumentOutline } from "@pdfslick/solid";
import { VsTriangleRight } from "solid-icons/vs";

type OutlineProps = {
  store: PDFSlickState;
  show: boolean;
};

const renderOutlineItems: Component<{
  outline: TPDFDocumentOutline | null;
  store: PDFSlickState;
  level?: number;
}> = ({ outline, store, level = 0 }) => {
  return (
    <ul class="w-full">
      <For each={outline ?? []}>
        {(item, ix) => (
          <li class="relative p-1 py-px">
            <input
              id={`${item.title}-${ix}`}
              type="checkbox"
              checked={false}
              class="peer absolute -top-[10000px] -left-[10000px]"
            />
            <div class="flex items-start peer-checked:[&>label]:rotate-90">
              {item.items?.length > 0 ? (
                <label
                  for={`${item.title}-${ix}`}
                  class="cursor-pointer mt-1 hover:text-slate-900 rounded p-1 hover:bg-slate-200"
                >
                  <VsTriangleRight class="w-4 py-px" />
                </label>
              ) : (
                <span class="block w-6" />
              )}
              <button
                class="flex-1 rounded text-left hover:text-slate-900 p-1 hover:bg-slate-200"
                onClick={() =>
                  store.pdfSlick?.linkService?.goToDestination(item.dest)
                }
              >
                {item.title}
              </button>
            </div>
            <div class="hidden peer-checked:block pl-1">
              {item.items?.length > 0 &&
                renderOutlineItems({
                  outline: item.items,
                  store,
                  level: level + 1,
                })}
            </div>
          </li>
        )}
      </For>
    </ul>
  );
};

const Outline = (props: OutlineProps) => {
  return (
    <div
      class="overflow-auto absolute inset-0"
      classList={{ invisible: !props.show }}
    >
      <div class="p-2 pl-0.5 text-slate-700 text-sm">
        {renderOutlineItems({
          outline: props.store.documentOutline,
          store: props.store,
        })}
      </div>
    </div>
  );
};

export default Outline;
