import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { VscChevronDown } from "react-icons/vsc";
import { default as colors, colorNames, colorStrengths } from "../colors";
import type { TUsePDFSlickStore } from "@pdfslick/react";

type PinMenuProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  setPinColor: (color: string) => void;
};

const PinMenu = ({ usePDFSlickStore, setPinColor }: PinMenuProps) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  return (
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
          <Menu.Items className="absolute right-0 z-30 mt-2 origin-top-right rounded-sm text-left bg-white divide-y divide-slate-200 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="flex flex-col space-y-1 p-2">
              <div className="text-sm font-medium text-gray-900 py-1">
                Color
              </div>
              {colorStrengths.map((s) => (
                <div className="flex space-x-1" key={s}>
                  {colorNames.map((name) => (
                    <button
                      key={`${name}-${s}`}
                      className="p-2 block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300"
                      style={{
                        backgroundColor: colors[name][s],
                      }}
                      onClick={() => {
                        setPinColor(colors[name][s]);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
  );
};

export default PinMenu;