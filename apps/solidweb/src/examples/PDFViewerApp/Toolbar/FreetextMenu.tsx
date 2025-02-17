import { VsChevronDown, VsCaseSensitive } from "solid-icons/vs";
import { AnnotationEditorType, AnnotationEditorParamsType } from "pdfjs-dist";
import { default as colors, colorNames, colorStrengths } from "../colors";
import { DropdownMenu } from "@kobalte/core";

import type { PDFSlickState } from "@pdfslick/solid";

type TFreetextMenuProps = {
  store: PDFSlickState;
};

const FreetextMenu = ({ store }: TFreetextMenuProps) => {
  const isFreetextMode = () =>
    store.annotationEditorMode === AnnotationEditorType.FREETEXT;

  return (
    <div
      class={`flex items-center group rounded-sm ${
        isFreetextMode() ? "bg-blue-100" : "hover:bg-slate-200/50"
      }`}
    >
      <button
        class={`enabled:hover:text-black text-slate-600 p-0.5 disabled:text-slate-300 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
        onClick={() => {
          const mode = isFreetextMode()
            ? AnnotationEditorType.NONE
            : AnnotationEditorType.FREETEXT;
          store.pdfSlick?.setAnnotationEditorMode(mode);
        }}
      >
        <VsCaseSensitive class="w-5 h-5" />
      </button>

      <DropdownMenu.Root isModal={false}>
        <DropdownMenu.Trigger
          disabled={!store.pdfSlick}
          class="h-6 hover:group-hover:enabled:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-xs transition-all focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div class="p-0.5">
            <VsChevronDown class="w-3 h-3" />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="absolute right-0 z-30 mt-2 origin-top-right rounded-xs text-left bg-white divide-y divide-slate-200 shadow-lg ring-1 ring-black/5 focus:outline-hidden animate-content-hide ui-expanded:animate-content-show"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
          >
            <div class="flex flex-col space-y-1 p-2">
              <div class="text-sm font-medium text-gray-900 py-1">Color</div>
              {colorStrengths.map((s) => (
                <div class="flex space-x-1">
                  {colorNames.map((name) => (
                    <DropdownMenu.Item
                      closeOnSelect={false}
                      class="p-2 cursor-pointer block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300 focus:ring-0 focus:outline-hidden focus:scale-125 focus:border-blue-300"
                      style={{
                        "background-color": colors[name][s],
                      }}
                      onSelect={() => {
                        store.pdfSlick?.setAnnotationEditorMode(
                          AnnotationEditorType.FREETEXT
                        );
                        store.pdfSlick?.setAnnotationEditorParams([
                          {
                            type: AnnotationEditorParamsType.FREETEXT_COLOR,
                            value: colors[name][s],
                          },
                        ]);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div class="p-2 flex flex-col">
              <DropdownMenu.Item
                class="py-1 flex space-x-2 items-center"
                closeOnSelect={false}
              >
                <label
                  for="fontSize"
                  class="text-sm w-20 font-medium text-gray-900"
                >
                  Font Size
                </label>
                <div class="w-full flex flex-1 items-center">
                  <input
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    value={12}
                    id="fontSize"
                    type="range"
                    min={12}
                    max={100}
                    onChange={(e) => {
                      store.pdfSlick?.setAnnotationEditorParams([
                        {
                          type: AnnotationEditorParamsType.FREETEXT_SIZE,
                          value: +e.currentTarget.value,
                        },
                      ]);
                    }}
                  />
                </div>
              </DropdownMenu.Item>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default FreetextMenu;
