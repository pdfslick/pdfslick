import Link from "next/link";
import clsx from "clsx";
import { examples } from "../../components/examples";
import { Header } from "../../components/Header";
import "@pdfslick/react/dist/pdf_viewer.css";
import Head from "next/head";
import Footer from "../../components/Footer";

export default function Examples() {
  return (
    <div className="pdfSlick">
      <Head>
        <title>PDFSlick React Examples</title>
        <meta name="description" content="PDF React examples" />
      </Head>

      <Header alwaysShowBorders />
      <div className="mt-16 sm:mt-20">
        <div className="relative max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto sm:text-center">
          <h1 className="mt-6 text-[2.5rem] leading-none sm:text-6xl tracking-tight font-bold text-slate-900 ">
            Get Inspired
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Embrace PDFs in your app — draw inspirations and insights through
            the examples.
          </p>
        </div>
        <div className="mx-auto overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {examples.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group text-sm h-full"
              >
                <div className="h-full rounded-lg p-3 ring-1 ring-inset ring-slate-200 bg-stone-50">
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
                  <p className="text-gray-500">{example.short ?? ""}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
