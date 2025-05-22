export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto pb-6 px-4 sm:px-6 md:px-8">
      <div className="mt-16 pt-10 flex flex-col space-y-2 items-center justify-center">
        <img src="/pdfslick_logo.svg" alt="PDFSlick" className="h-6" />
        <div className="text-sm text-slate-400 text-center">
          © {new Date().getFullYear()} PDFSlick by <a
            className="text-slate-500 hover:text-slate-600 hover:underline"
            href="https://stojkov.me"
            target="_blank"
            rel="noreferrer"
          >
            Vancho Stojkov
          </a>. All rights reserved. <br /> Logo
          designed by{" "}
          <a
            className="text-slate-500 hover:text-slate-600 hover:underline"
            href="https://kosturanov.com/portfolio/logo-branding-design"
            target="_blank"
            rel="noreferrer"
          >
            Vane Kosturanov
          </a>
        </div>
      </div>
    </footer>
  );
}
