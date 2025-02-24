import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { VscChevronDown, VscCaseSensitive } from "react-icons/vsc";
import { AnnotationEditorType, AnnotationEditorParamsType } from "pdfjs-dist";
import { default as colors, colorNames, colorStrengths } from "../colors";

import type { TUsePDFSlickStore } from "@pdfslick/react";

type FreetextMenuProps = {
  usePDFSlickStore: TUsePDFSlickStore;
};

const FreetextMenu = ({ usePDFSlickStore }: FreetextMenuProps) => {
  const annotationEditorMode = usePDFSlickStore((s) => s.annotationEditorMode);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
  const isFreetextMode = annotationEditorMode === AnnotationEditorType.FREETEXT;

  return (
    <div
      className={`flex items-center group rounded-sm ${
        isFreetextMode ? "bg-blue-100" : "hover:bg-slate-200/50"
      }`}
    >
      <button
        className={`enabled:hover:text-black text-slate-600 p-0.5 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent`}
        onClick={() => {
          const mode = isFreetextMode
            ? AnnotationEditorType.NONE
            : AnnotationEditorType.FREETEXT;
          pdfSlick?.setAnnotationEditorMode(mode);
        }}
      >
        <VscCaseSensitive className="w-5 h-5" />
      </button>

      <Menu as="div" className="text-xs relative h-6">
        <Menu.Button
          disabled={!pdfSlick}
          className={`h-6 enabled:group-hover:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-sm transition-all focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent`}
        >
          <div className="p-0.5">
            <VscChevronDown className="w-3 h-3" />
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-30 mt-1 origin-top-right rounded-sm text-left bg-white divide-y divide-slate-200 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="flex flex-col space-y-0.5 p-2">
              <div className="text-sm font-medium text-gray-900 py-1">
                Color
              </div>
              {colorStrengths.map((s) => (
                <div className="flex space-x-0.5" key={s}>
                  {colorNames.map((name) => (
                    // <Menu.Item key={`${name}-${s}`}>
                    <button
                      key={`${name}-${s}`}
                      className="p-2 rounded-full border border-slate-200 hover:border-slate-400 hover:shadow-sm focus:ring-blue-500"
                      style={{
                        backgroundColor: colors[name][s],
                      }}
                      onClick={() => {
                        pdfSlick?.setAnnotationEditorMode(
                          AnnotationEditorType.FREETEXT
                        );
                        pdfSlick?.setAnnotationEditorParams([
                          {
                            type: AnnotationEditorParamsType.FREETEXT_COLOR,
                            value: colors[name][s],
                          },
                        ]);
                      }}
                    />
                    // </Menu.Item>
                  ))}
                </div>
              ))}
            </div>

            <div className="p-2 flex flex-col">
              <div className="py-1 flex space-x-2 items-center">
                <label
                  htmlFor="innkThickness"
                  className="text-sm w-20 font-medium text-gray-900"
                >
                  Font Size
                </label>
                <div className="w-full flex flex-1 items-center">
                  <input
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    defaultValue={1}
                    type="range"
                    min={12}
                    max={100}
                    onChange={(e) => {
                      pdfSlick?.setAnnotationEditorParams([
                        {
                          type: AnnotationEditorParamsType.FREETEXT_SIZE,
                          value: +e.target.value,
                        },
                      ]);
                    }}
                  />
                </div>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default FreetextMenu;
