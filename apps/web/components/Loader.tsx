import clsx from "clsx";
import { useState } from "react";
import { useInterval } from "react-use";

type LoaderProps = {
  color?: string;
  text?: string;
  bgColor?: string;
};

export default function Loader({ color, text, bgColor }: LoaderProps) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 250);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-center z-50">
      <div
        className={clsx("absolute w-full inset-0 backdrop-blur-sm z-10", {
          "bg-white/10": !bgColor,
          ...(bgColor && { [bgColor]: true }),
        })}
      />
      <div
        className={clsx(
          "flex flex-col w-full z-20 items-center py-2 leading-6 text-sm transition ease-in-out duration-150 cursor-default",
          {
            "text-blue-700": !color,
            ...(color && { [color]: true }),
          }
        )}
      >
        <svg
          className="animate-spin h-8 w-8 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className={color ?? "text-blue-700"}>
          {text ?? "Loading data"}{" "}
          <i className={`${count % 4 > 0 ? "visible" : "invisible"}`}>.</i>
          <i className={`${count % 4 > 1 ? "visible" : "invisible"}`}>.</i>
          <i className={`${count % 4 > 2 ? "visible" : "invisible"}`}>.</i>
        </span>
      </div>
    </div>
  );
}
