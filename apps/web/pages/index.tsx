import { useEffect, useState } from "react";
import clsx from "clsx";
import { useInterval } from "react-use";
import Link from "next/link";
import Head from "next/head";
import { examples } from "../components/examples";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

export default function Example() {
  const [rotation, setRotation] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);

  const updateVals = () => {
    setRotation(~~(Math.random() * 45));
    setX(~~(-200 + Math.random() * 100));
    setY(~~(0 + Math.random() * 200));
    setScale(~~(80 + Math.random() * 20) / 100);
  };

  useEffect(() => {
    updateVals();
  }, []);

  useInterval(() => {
    updateVals();
  }, 5000);

  return (
    <div className="">
      <Head>
        <title>PDFSlick</title>
        <meta
          name="description"
          content="View and interact with PDFs in your React and SolidJS apps."
        />
      </Head>

      <Header />
      <div className="relative pt-14">
        <div
          className="absolute transition-all duration-[5000ms] ease-linear inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          style={{
            transform: `rotate(${rotation}deg) scale(${scale}) translate(${x}px,${y}px)`,
          }}
          aria-hidden="true"
        >
          <div
            className={clsx(
              "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            )}
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                <img src="/pdfslick_logo.svg" alt="PDFSlick" />
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                View and interact with PDFs in your React and SolidJS apps
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/docs"
                  className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 relative rounded-xl bg-gradient-to-tr from-pink-50 to-violet-50 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 aspect-[16/9] flex flex-col">
                <div className="bg-slate-50 rounded-md shadow-2xl ring-1 w-full flex-1 ring-gray-900/10">
                  <div className="mt-16 sm:mt-20">
                    <div className="relative max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto sm:text-center">
                      <h1 className="mt-6 text-[2.5rem] leading-none sm:text-6xl tracking-tight font-bold text-slate-800">
                        See it in Action
                      </h1>
                      <p className="mt-4 text-lg text-slate-600">
                        Embrace PDFs as you would any other part of your React
                        and SolidJS apps — draw inspiration from these examples.
                      </p>
                    </div>
                    <div className="mx-auto overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                        {examples.map((example) => (
                          <Link
                            key={example.href}
                            href={example.href}
                            className="h-full group text-sm"
                          >
                            <div className="h-full rounded-lg p-3 ring-1 ring-inset ring-slate-200 bg-stone-100">
                              <div
                                className={clsx(
                                  "aspect-[16/9] w-full overflow-hidden rounded  group-hover:opacity-75 shadow-sm border border-slate-300",
                                  "group-hover:shadow-md"
                                )}
                              >
                                <img
                                  src={example.imageSrc}
                                  alt={example.name}
                                  className="h-full w-full object-cover object-center "
                                />
                              </div>
                              <h3 className="mt-4 mb-1 text-xl font-medium text-gray-900">
                                {example.name}
                              </h3>
                              <p className="text-gray-500">
                                {example.short ?? ""}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
