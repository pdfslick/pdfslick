import clsx from "clsx";
import { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  position?: "bottom" | "right";
  alignX?: "center" | "right" | "left";
};

const Tooltip = ({
  children,
  position = "right",
  alignX = "center",
}: TooltipProps) => {
  return (
    <div
      role="tooltip"
      className={clsx(
        "absolute z-10 inline-block text-xs transition-opacity duration-300",
        "rounded-sm shadow opacity-0 invisible",
        "text-gray-500 bg-slate-50 border border-slate-300",
        "group-hover:visible group-hover:opacity-100",
        {
          "left-full top-1/2 -translate-y-1/2 ml-4": position === "right",
          "top-full mt-2": position === "bottom",
          "right-1/2 translate-x-1/2":
            position === "bottom" && alignX === "center",
          "right-0": position === "bottom" && alignX === "right",
          "left-0": position === "bottom" && alignX === "left",
        }
      )}
    >
      <div className="px-2 py-1.5">{children}</div>
      {position === "right" && (
        <div
          className={clsx(
            "absolute w-[6px] h-[6px] bg-inherit invisible -left-[8px] top-1/2 -mt-[4px]",
            "before:absolute before:w-[6px] before:h-[6px] before:bg-inherit before:visible before:rotate-45 before:content-['']",
            "after:absolute after:w-[7px] after:h-[7px] after:bg-inherit after:visible after:rotate-45 after:content-['']",
            "before:border-b before:border-l before:border-solid before:border-slate-300",
            "after:border-b after:border-l after:border-solid after:border-slate-300",
            "after:invisible before:invisible group-hover:after:visible group-hover:before:visible"
          )}
        />
      )}

      {position === "bottom" && (
        <div
          className={clsx(
            "absolute w-[6px] h-[6px] bg-inherit invisible -top-[5px]",
            "before:absolute before:w-[6px] before:h-[6px] before:bg-inherit before:visible before:rotate-45 before:content-['']",
            "after:absolute after:w-[7px] after:h-[7px] after:bg-inherit after:visible after:rotate-45 after:content-['']",
            "before:border-t before:border-l before:border-solid before:border-slate-300",
            "after:border-t after:border-l after:border-solid after:border-slate-300",
            "after:invisible before:invisible group-hover:after:visible group-hover:before:visible",

            {
              "left-1/2 -ml-[6px]": alignX === "center",
              "right-0 mr-[12px]": alignX === "right",
              "left-0 ml-[6px]": alignX === "left",
            }
          )}
        />
      )}
    </div>
  );
};

export default Tooltip;
