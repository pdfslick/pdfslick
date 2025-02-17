import { DropdownMenu, HoverCard } from "@kobalte/core";
import { VsAdd, VsRemove, VsChevronDown } from "solid-icons/vs";
import { type PDFSlickState } from "@pdfslick/solid";

const presets = new Map([
  ["auto", "Auto"],
  ["page-actual", "Actual Size"],
  ["page-fit", "Page Fit"],
  ["page-width", "Page Width"],
]);

const zoomVals = new Map([
  [0.5, "50%"],
  [0.75, "75%"],
  [1, "100%"],
  [1.25, "125%"],
  [1.5, "150%"],
  [2, "200%"],
]);

type TZoomSelectorProps = {
  store: PDFSlickState;
};

const ZoomSelector = ({ store }: TZoomSelectorProps) => {
  return (
    <div class="flex items-center space-x-1">
      <button
        disabled={!store.pdfSlick || store.scale <= 0.25}
        class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
        onClick={() => store.pdfSlick?.viewer?.decreaseScale()}
      >
        <VsRemove class="h-4 w-4 fill-current" />
        <HoverCard.Root openDelay={150} closeDelay={0}>
          <HoverCard.Trigger class="absolute inset-0" />
          <HoverCard.Portal>
            <HoverCard.Content class="animate-content-hide z-50 py-1 px-2.5 text-xs ui-expanded:animate-content-show rounded-sm shadow-md bg-neutral-800 border border-neutral-900 text-slate-100">
              <HoverCard.Arrow />
              <span class="space-y-1">
                <span class="opacity-90 text-center block whitespace-nowrap">
                  Zoom Out
                </span>
                <span class="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span class="w-5 h-5 flex items-center justify-center bg-white/10 rounded-xs">
                    ⌘
                  </span>
                  <span class="w-5 h-5 flex items-center justify-center bg-white/10 rounded-xs">
                    —
                  </span>
                </span>
              </span>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </button>

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          class="flex w-32 text-left items-center bg-slate-200/70 hover:bg-slate-200 py-1 rounded-xs focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span class="sr-only">Open zoom options</span>
          <div class="flex px-1 w-full">
            <span
              class={`flex-1 px-1 ${
                store.pdfSlick ? "opacity-100" : "opacity-0"
              }`}
            >
              {store.scaleValue && presets.has(store.scaleValue)
                ? presets.get(store.scaleValue)
                : `${~~(store.scale * 100)}%`}
            </span>

            <div class="w-4 h-4">
              <VsChevronDown class="w-4 h-4" />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="absolute w-32 max-w-[142px] right-0 left-0 z-30 mt-1 origin-top-right divide-y divide-slate-200 rounded-sm text-left bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden animate-content-hide ui-expanded:animate-content-show"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
          >
            <div class="py-1">
              {Array.from(presets.entries()).map(([value, label]) => (
                <DropdownMenu.Item
                  onSelect={() => {
                    store.pdfSlick!.currentScaleValue = value;
                  }}
                  class={`cursor-pointer block w-full text-left px-2 py-1.5 text-xs hover:bg-slate-100 hover:text-slate-900 ui-highlighted:bg-slate-100 ui-highlighted:text-slate-900 ui-not-highlighted:text-slate-700`}
                >
                  {label}
                </DropdownMenu.Item>
              ))}
            </div>

            <div class="py-1">
              {Array.from(zoomVals.entries()).map(([value, label]) => (
                <DropdownMenu.Item
                  onSelect={() => {
                    store.pdfSlick!.currentScale = value;
                  }}
                  class={`cursor-pointer block w-full text-left px-2 py-1.5 text-xs hover:bg-slate-100 hover:text-slate-900 ui-highlighted:bg-slate-100 ui-highlighted:text-slate-900 ui-not-highlighted:text-slate-700`}
                >
                  {label}
                </DropdownMenu.Item>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <button
        disabled={!store.pdfSlick || store.scale >= 5}
        class="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
        onClick={() => store.pdfSlick?.viewer?.increaseScale()}
      >
        <VsAdd class="h-4 w-4 fill-current" />
        <HoverCard.Root openDelay={150} closeDelay={0}>
          <HoverCard.Trigger class="absolute inset-0" />
          <HoverCard.Portal>
            <HoverCard.Content class="animate-content-hide z-50 py-1 px-2.5 text-xs ui-expanded:animate-content-show rounded-sm shadow-md bg-neutral-800 border border-neutral-900 text-slate-100">
              <HoverCard.Arrow />
              <span class="space-y-1">
                <span class="opacity-90 text-center block whitespace-nowrap">
                  Zoom In
                </span>
                <span class="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span class="w-5 h-5 flex items-center justify-center bg-white/10 rounded-xs">
                    ⌘
                  </span>
                  <span class="w-5 h-5 flex items-center justify-center bg-white/10 rounded-xs">
                    +
                  </span>
                </span>
              </span>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </button>
    </div>
  );
};

export default ZoomSelector;
