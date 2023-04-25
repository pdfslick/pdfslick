import { VscScreenFull } from "react-icons/vsc";
import Logo from "./Logo";

export default function Fab() {
  return (
    <div className="absolute flex space-x-2 items-center bottom-3 right-3 transition-opacity z-20 bg-slate-50 bg-opacity-60 backdrop-blur-sm border border-slate-300 shadow-sm rounded px-2 py-1.5">
      <Logo className="h-3" />
      <button className="text-slate-500 hover:text-slate-900 transition-all">
        <VscScreenFull className="h-5" />
      </button>
    </div>
  );
}
