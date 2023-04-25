export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 dark:divide-slate-700">
      <div className="mt-16 pt-10 flex flex-col space-y-2 items-center justify-center">
        <img src="/pdfslick_logo.svg" alt="PDFSlick" className="h-6" />
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} PDFSlick. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
