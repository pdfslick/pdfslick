import { VscPinnedDirty } from "react-icons/vsc";
import PinMenu from "./Toolbar/PinMenu";
import { TUsePDFSlickStore } from "@pdfslick/react";

type PinButtonProps = {
    isActive: boolean;
    onToggle: () => void;
    usePDFSlickStore: TUsePDFSlickStore;
    setPinColor: (color: string) => void;
};

export default function PinButton({ isActive, onToggle, usePDFSlickStore, setPinColor }: PinButtonProps) {
    return (
        <div className={`flex items-center rounded-sm group ${isActive ? "bg-blue-100" : "hover:bg-slate-200/50"}`}>
            <button
                type="button"
                className="enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
                onClick={onToggle}
            >
                <VscPinnedDirty className="h-4 w-4" />
            </button>
            <PinMenu usePDFSlickStore={usePDFSlickStore} setPinColor={setPinColor} />
        </div>
    );
}
