import { VsChevronDown, VsEdit } from "solid-icons/vs";
import { AnnotationEditorType, AnnotationEditorParamsType } from "pdfjs-dist";
import { default as colors, colorNames, colorStrengths } from "../colors";
import { DropdownMenu } from "@kobalte/core";
import { type PDFSlickState } from "@pdfslick/solid";

type TInkMenuProps = {
  store: PDFSlickState;
};

const InkMenu = ({ store }: TInkMenuProps) => {
  const isInkMode = () =>
    store.annotationEditorMode === AnnotationEditorType.INK;

  return (
    <div
      class={`flex items-center rounded-sm group ${
        isInkMode() ? "bg-blue-100" : "hover:bg-slate-200/50"
      }`}
    >
      <button
        class={` enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent`}
        onClick={() => {
          const mode = isInkMode()
            ? AnnotationEditorType.NONE
            : AnnotationEditorType.INK;
          store.pdfSlick?.setAnnotationEditorMode(mode);
        }}
      >
        <VsEdit class="w-4 h-4" />
      </button>

      <DropdownMenu.Root isModal={false}>
        <DropdownMenu.Trigger
          disabled={!store.pdfSlick}
          class="h-6 enabled:group-hover:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-sm transition-all focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
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
            class="absolute right-0 z-30 mt-2 origin-top-right rounded-sm text-left bg-white divide-y divide-slate-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-content-hide ui-expanded:animate-content-show"
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
                      class="p-2 cursor-pointer block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300 focus:ring-0 focus:outline-none focus:scale-125 focus:border-blue-300"
                      style={{
                        "background-color": colors[name][s],
                      }}
                      onSelect={() => {
                        store.pdfSlick?.setAnnotationEditorMode(
                          AnnotationEditorType.INK
                        );
                        store.pdfSlick?.setAnnotationEditorParams([
                          {
                            type: AnnotationEditorParamsType.INK_COLOR,
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
                  for="inkThickness"
                  class="text-sm w-20 font-medium text-gray-900"
                >
                  Thickness
                </label>
                <div class="w-full flex flex-1 items-center">
                  <input
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    value={1}
                    id="inkThickness"
                    type="range"
                    min={1}
                    max={100}
                    onChange={(e) => {
                      store.pdfSlick?.setAnnotationEditorParams([
                        {
                          type: AnnotationEditorParamsType.INK_THICKNESS,
                          value: +e.currentTarget.value,
                        },
                      ]);
                    }}
                  />
                </div>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                class="py-1 flex space-x-2 items-center"
                closeOnSelect={false}
              >
                <label
                  for="inkOpacity"
                  class="text-sm w-20 font-medium text-gray-900"
                >
                  Opacity
                </label>
                <div class="w-full flex flex-1 items-center">
                  <input
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    id="inkOpacity"
                    value={100}
                    type="range"
                    min={0}
                    max={100}
                    onChange={(e) => {
                      store.pdfSlick?.setAnnotationEditorParams([
                        {
                          type: AnnotationEditorParamsType.INK_OPACITY,
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

export default InkMenu;
