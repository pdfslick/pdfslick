import { useState } from "react";
import clsx from "clsx";
import { useInterval } from "react-use";
import { RIP } from "./RIP";
import { allColors } from "./colors";
import ColorLoader from "./ColorsLoader";

type BlurredRIPBgProps = {
  className: string;
};

export default function BlurredRIPBg({ className }: BlurredRIPBgProps) {
  const rip = new RIP({
    numOfPoints: 20,
    minCoordVal: 0,
    maxCoordVal: 100,
  });

  const generateClipPath = () => {
    const polygon = rip
      .getRandomPoints()
      .map(({ x, y }) => `${x}% ${y}%`)
      .join(", ");

    console.log(polygon);
    return `polygon(${polygon})`;
  };

  const getColor = () => allColors[~~(Math.random() * allColors.length)];
  const getOpacity = () => ~~(30 + Math.random() * 20);

  const [clipPath, setClipPath] = useState(generateClipPath());
  const [fromColor, setFromColor] = useState(getColor());
  const [toColor, setToColor] = useState(getColor());
  const [opacity, setOpacity] = useState(getOpacity);

  useInterval(() => {
    setClipPath(generateClipPath());
    setFromColor(getColor());
    setToColor(getColor());
    setOpacity(getOpacity);
  }, 5000);
  return (
    <>
      <ColorLoader />
      {/* <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(80%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#000000] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div> */}
      {/* <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div> */}

      <div
        className={clsx(
          className,
          "transition-all duration-[5000ms] ease-linear"
          // `from-[${fromColor}]`,
          // `to-[${toColor}]`
        )}
        style={{
          clipPath,
          // opacity: `${opacity / 100}`,
        }}
      />
    </>
  );
}
