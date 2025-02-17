import type { Accessor, Setter } from "solid-js";
import { VsVersions, VsListTree, VsSaveAll } from "solid-icons/vs";

import { type PDFSlickState } from "@pdfslick/solid";
import Tooltip from "../Tooltip";

type ButtonsBarProps = {
  store: PDFSlickState;
  isThumbsbarOpen: Accessor<boolean>;
  setTab: Setter<"thumbnails" | "outline" | "attachments">;
  tab: Accessor<"thumbnails" | "outline" | "attachments">;
};

const ButtonsBar = ({
  store,
  isThumbsbarOpen,
  setTab,
  tab,
}: ButtonsBarProps) => {
  return (
    <div
      class={`bg-slate-100/70 z-10 flex flex-col p-1 py-2 space-y-3 items-center border-r border-r-slate-300 shadow-xs transition-all [box-shadow:1px_0_2px_0_rgb(0_0_0_/_0.05)]`}
      classList={{
        "translate-x-0 visible opacity-100": isThumbsbarOpen(),
        "-translate-x-full invisible opacity-0": !isThumbsbarOpen(),
      }}
    >
      <button
        disabled={!store.pdfSlick}
        class={`enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
        classList={{
          "enabled:bg-blue-100 enabled:text-black border-blue-200":
            !!store.pdfSlick && tab() === "thumbnails",
        }}
        onClick={() => setTab("thumbnails")}
      >
        <VsVersions class="h-4 w-4" />
        <Tooltip>
          <p class="whitespace-nowrap">Page Thumbnails</p>
        </Tooltip>
      </button>
      <button
        disabled={!store.documentOutline}
        class={`enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
        classList={{
          "enabled:bg-blue-100 enabled:text-black border-blue-200":
            tab() === "outline",
        }}
        onClick={() => setTab("outline")}
      >
        <VsListTree class="h-4 w-4" />
        <Tooltip>
          <p class="whitespace-nowrap">Document Outline</p>
        </Tooltip>
      </button>
      <button
        disabled={store.attachments?.size < 1}
        class={`enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
        classList={{
          "enabled:bg-blue-100 enabled:text-black border-blue-200":
            tab() === "attachments",
        }}
        onClick={() => setTab("attachments")}
      >
        <VsSaveAll class="h-4 w-4" />
        <Tooltip>
          <p class="whitespace-nowrap">Attachments</p>
        </Tooltip>
      </button>
    </div>
  );
};

export default ButtonsBar;
