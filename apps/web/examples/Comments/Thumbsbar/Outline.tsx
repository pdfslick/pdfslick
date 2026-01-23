import { FC } from "react";
import clsx from "clsx";
import {
  PDFSlick,
  type TPDFDocumentOutline,
  type TUsePDFSlickStore,
} from "@pdfslick/react";
import { VscTriangleRight } from "react-icons/vsc";

type OutlineProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  show: boolean;
};

const renderOutlineItems: FC<{
  outline: TPDFDocumentOutline | null;
  pdfSlick: PDFSlick | null;
  level?: number;
}> = ({ outline, pdfSlick, level = 0 }) => {
  return (
    <ul className="w-full">
      {(outline ?? []).map((item, ix) => (
        <li key={`${item.title}-${ix}`} className="relative p-1 py-px">
          <input
            id={`${item.title}-${ix}`}
            type="checkbox"
            defaultChecked={false}
            className="peer absolute -top-[10000px] -left-[10000px]"
          />
          <div className="flex items-start peer-checked:[&>label]:rotate-90">
            {item.items?.length > 0 ? (
              <label
                htmlFor={`${item.title}-${ix}`}
                className="cursor-pointer mt-1 hover:text-slate-900 rounded p-1 hover:bg-slate-200"
              >
                <VscTriangleRight className="w-4 py-px" />
              </label>
            ) : (
              <span className="block w-6" />
            )}
            <button
              className="flex-1 rounded text-left hover:text-slate-900 p-1 hover:bg-slate-200"
              onClick={() => pdfSlick?.linkService?.goToDestination(item.dest)}
            >
              {item.title}
            </button>
          </div>
          <div className="hidden peer-checked:block pl-1">
            {item.items?.length > 0 &&
              renderOutlineItems({
                outline: item.items,
                pdfSlick,
                level: level + 1,
              })}
          </div>
        </li>
      ))}
    </ul>
  );
};

const Outline = ({ usePDFSlickStore, show }: OutlineProps) => {
  const documentOutline = usePDFSlickStore((s) => s.documentOutline);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  return (
    <div
      className={clsx("overflow-auto absolute inset-0", { invisible: !show })}
    >
      <div className="p-2 pl-0.5 text-slate-700 text-sm">
        {renderOutlineItems({ outline: documentOutline, pdfSlick })}
      </div>
    </div>
  );
};

export default Outline;
