import { VsChevronDown } from "solid-icons/vs";
import { TbHighlight } from 'solid-icons/tb'
import { AnnotationEditorType, AnnotationEditorParamsType } from "pdfjs-dist";
import { default as colors, colorNames, colorStrengths } from "../colors";
import { DropdownMenu } from "@kobalte/core";
import { type PDFSlickState } from "@pdfslick/solid";
import ToggleSwitch from "./ToggleSwitch";
import { createEffect, createSignal } from "solid-js";

type THighlightMenuProps = {
    store: PDFSlickState;
};

const parseHighlightColors = (value: string | undefined) => {
    if (!value) {
        return []
    }
    const colors = value.split(',')

    return colors.map(c => {
        const kv = c.split('=')
        return { name: kv[0], color: kv[1] }
    })
}

const HighlightMenu = ({ store }: THighlightMenuProps) => {
    const isHighlightMode = () =>
        store.annotationEditorMode === AnnotationEditorType.HIGHLIGHT;

    const [highlightColors, setHighlightColors] = createSignal([] as { name: string, color: string }[])

    createEffect(() => {
        if (highlightColors.length < 1 && store.pdfSlick) {
            const colors = parseHighlightColors(store.pdfSlick?.annotationEditorHighlightColors)
            setHighlightColors(colors)
        }
    })

    return (
        <div
            class={`flex items-center rounded-xs group ${isHighlightMode() ? "bg-blue-100" : "hover:bg-slate-200/50"}`}
        >
            <button
                class={` enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-xs transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
                onClick={() => {
                    const mode = isHighlightMode()
                        ? AnnotationEditorType.NONE
                        : AnnotationEditorType.HIGHLIGHT;
                    store.pdfSlick?.setAnnotationEditorMode(mode);
                }}
            >
                <TbHighlight class="w-4 h-4" />
            </button>

            <DropdownMenu.Root modal={false}>
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
                            <div class="text-sm font-medium text-gray-900 py-1">Highlight Color</div>
                            <div class="flex space-x-1">
                                {highlightColors().map((highlightColor) => (
                                    <DropdownMenu.Item
                                        closeOnSelect={false}
                                        class={`
                                        p-2 
                                        cursor-pointer 
                                        block 
                                        rounded-full 
                                        origin-center 
                                        relative
                                        hover:scale-125 
                                        focus:ring-0 
                                        focus:outline-hidden 
                                        focus:scale-125
                                        ${store.highlightDefaultColor === highlightColor.color
                                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                                : 'border border-transparent hover:border-blue-300 focus:border-blue-300'
                                            }
                                        `}
                                        style={{
                                            "background-color": highlightColor.color,
                                        }}
                                        onSelect={() => {
                                            store.pdfSlick?.setHighlightDefaultColor(highlightColor.color)
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div class="p-2 flex flex-col">
                            <DropdownMenu.Item
                                class="py-1 flex space-x-2 items-center"
                                closeOnSelect={false}
                            >
                                <label
                                    for="highlightThickness"
                                    class="text-sm w-20 font-medium text-gray-900"
                                >
                                    Thickness
                                </label>
                                <div class="w-full flex flex-1 items-center">
                                    <input
                                        class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        value={1}
                                        id="highlightThickness"
                                        type="range"
                                        min={1}
                                        max={100}
                                        onChange={(e) => {
                                            store.pdfSlick?.setAnnotationEditorParams([
                                                {
                                                    type: AnnotationEditorParamsType.HIGHLIGHT_THICKNESS,
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
                                <label for="editorHighlightShowAll" class="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-show-all-button-label">Show all</label>
                                <div class="w-full flex flex-1 items-center">
                                    <ToggleSwitch id="editorHighlightShowAll" enabled={true} onClick={(e) => {
                                        const ariaChecked = e.currentTarget.getAttribute("aria-checked");
                                        store.pdfSlick?.setAnnotationEditorParams([
                                            {
                                                type: AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL,
                                                value: ariaChecked == "true",
                                            },
                                        ]);
                                    }} />
                                </div>
                            </DropdownMenu.Item>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
};

export default HighlightMenu;
