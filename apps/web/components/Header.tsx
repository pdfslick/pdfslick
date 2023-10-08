import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useWindowScroll } from "react-use";

export const mainNavigation = [
  { name: "Examples", href: "/examples" },
  { name: "Get started", href: "/docs" },
  { name: "GitHub", href: "https://github.com/pdfslick/pdfslick" },
];

export type TDocsNavigationLink = {
  title: string;
  href: string;
};

export type TDocsNavigation = {
  title: string;
  links: TDocsNavigationLink[];
};
export const navigation: TDocsNavigation[] = [
  {
    title: "PDFSlick",
    links: [{ title: "Introduction", href: "/docs" }],
  },
  {
    title: "React",
    links: [
      { title: "Use with React", href: "/docs/react" },
      {
        title: "View PDF documents",
        href: "/docs/react-view-documents",
      },
      {
        title: "usePDFSlick()",
        href: "/docs/react-use-pdf-slick",
      },
      {
        title: "usePDFSlickStore()",
        href: "/docs/react-use-pdf-slick-store",
      },
    ],
  },
  {
    title: "Solid",
    links: [{ title: "Use with SolidJS", href: "/docs/solid" }],
  },
];

function GitHubIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  );
}

type HeaderProps = {
  alwaysShowBorders?: boolean;
};

export function Header({ alwaysShowBorders = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { y: scrollY } = useWindowScroll();

  return (
    <header
      className={clsx("sticky backdrop-blur-sm border-b top-0 z-30", {
        "border-gray-200 bg-white/50 shadow-sm":
          scrollY > 10 || alwaysShowBorders,
        "border-gray-100/0": scrollY <= 10 && !alwaysShowBorders,
      })}
    >
      <nav
        className={clsx(
          "flex items-center transition-all justify-between p-6 lg:p-2 lg:px-8",
          {
            // "py-4": scrollY > 10,
          }
        )}
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">PDFSlick</span>
            <img
              className={clsx(
                "w-auto transition-all ease-in-out duration-150",
                {
                  "h-6": scrollY > 10,
                  "h-8": scrollY <= 10,
                }
              )}
              src="/symbol.svg"
              alt="PDFSlick"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-2">
          {mainNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">PDFSlick</span>
              <img className="h-8 w-auto" src="/symbol.svg" alt="PDFSlick" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
