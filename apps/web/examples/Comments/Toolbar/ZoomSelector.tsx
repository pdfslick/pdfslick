import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { VscAdd, VscRemove, VscChevronDown } from "react-icons/vsc";
import type { TUsePDFSlickStore } from "@pdfslick/react";

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

type ZoomSelectorProps = {
  usePDFSlickStore: TUsePDFSlickStore;
};

const ZoomSelector = ({ usePDFSlickStore }: ZoomSelectorProps) => {
  const scale = usePDFSlickStore((s) => s.scale);
  const scaleValue = usePDFSlickStore((s) => s.scaleValue);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  return (
    <div className="flex items-center space-x-1">
      <button
        disabled={!pdfSlick || scale <= 0.25}
        className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        onClick={() => pdfSlick?.viewer?.decreaseScale()}
      >
        <VscRemove className="h-4 w-4 fill-current" />
      </button>

      <Menu as="div" className="text-xs relative hidden sm:block">
        <Menu.Button
          disabled={!pdfSlick}
          className="text-left w-32 bg-slate-200/70 hover:bg-slate-200 py-1 rounded-sm focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        >
          <span className="sr-only">Open zoom options</span>
          <div className="flex px-1">
            <span
              className={`flex-1 px-1 ${
                pdfSlick ? "opacity-100" : "opacity-0"
              }`}
            >
              {scaleValue && presets.has(scaleValue)
                ? presets.get(scaleValue)
                : `${~~(scale * 100)}%`}
            </span>

            <div className="w-4 h-4">
              <VscChevronDown className="w-4 h-4" />
            </div>
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
          <Menu.Items className="absolute right-0 left-0 z-30 mt-2 w-full origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              {Array.from(presets.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active, close }) => (
                    <button
                      onClick={() => {
                        pdfSlick!.currentScaleValue = value;
                      }}
                      className={`block w-full box-border text-left px-2 py-1.5 text-xs ${
                        active ? "bg-slate-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            <div className="py-1">
              {Array.from(zoomVals.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        pdfSlick!.currentScale = value;
                      }}
                      className={`block w-full box-border text-left px-2 py-1.5 text-xs ${
                        active ? "bg-slate-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={!pdfSlick || scale >= 5}
        className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        onClick={() => pdfSlick?.viewer?.increaseScale()}
      >
        <VscAdd className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
};

export default ZoomSelector;
