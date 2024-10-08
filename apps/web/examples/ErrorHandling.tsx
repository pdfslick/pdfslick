import { usePDFSlick } from "@pdfslick/react";

/** Import only once in root component like index.ts or root css.
import "@pdfslick/react/dist/pdf_viewer.css";
*/

type PDFViewerAppProps = {
  pdfFilePath: string;
};

const ErrorHandlingViewer = ({ pdfFilePath }: PDFViewerAppProps) => {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer, error } = usePDFSlick(
    pdfFilePath,
    {
      singlePageViewer: true,
      scaleValue: "page-fit",
    }
  );

  return (
    <div className="absolute inset-0 bg-slate-200/70 pdfSlick">
      <div className="flex-1 relative h-full">
        {!error && <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />}

        {error && (
          <div className="w-full max-w-screen-sm mx-auto py-4">
            <div
              id="alert-additional-content-2"
              className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
              role="alert"
            >
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg font-medium">
                  Error loading PDF document
                </h3>
              </div>
              <div className="mt-2 mb-4 text-sm">
                There was an error loading the PDF document: <i>{pdfFilePath}</i>.
                <br /> Here are the details:
                <div className="overflow-scroll py-2">
                  <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorHandlingViewer;
