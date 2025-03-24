/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AnnotationMode,
  PixelsPerInch,
  RenderingCancelledException,
  getXfaPageViewport,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";
import {
  SimpleLinkService,
  XfaLayerBuilder,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import { OptionalContentConfig } from "pdfjs-dist/types/web/pdf_viewer";

//
// https://github.com/mozilla/pdf.js/blob/master/web/print_utils.js
//
function getXfaHtmlForPrinting(
  printContainer: HTMLElement,
  pdfDocument: PDFDocumentProxy
) {
  const xfaHtml: any = pdfDocument.allXfaHtml;
  const linkService = new SimpleLinkService();
  const scale = Math.round(PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100;

  for (const xfaPage of xfaHtml?.children) {
    const page = document.createElement("div");
    page.className = "xfaPrintedPage";
    printContainer.append(page);

    const builder = new XfaLayerBuilder({
      pdfPage: null as unknown as PDFPageProxy,
      annotationStorage: pdfDocument.annotationStorage,
      linkService,
      xfaHtml: xfaPage,
    });
    const viewport = getXfaPageViewport(xfaPage, { scale });

    builder.render({ viewport, intent: "print" });
    page.append(builder.div!);
  }
}

let activeService: PDFPrintService | null = null;

// Renders the page to the canvas of the given print service, and returns
// the suggested dimensions of the output page.
function renderPage(
  printService: PDFPrintService,
  pdfDocument: PDFDocumentProxy,
  pageNumber: number,
  size: { width: number; height: number; rotation: number },
  printResolution: number,
  optionalContentConfigPromise: Promise<OptionalContentConfig> | null,
  printAnnotationStoragePromise: Promise<PDFDocumentProxy["annotationStorage"] | void>
) {
  const scratchCanvas = printService.scratchCanvas;

  // The size of the canvas in pixels for printing.
  const PRINT_UNITS = printResolution / PixelsPerInch.PDF;
  scratchCanvas.width = Math.floor(size.width * PRINT_UNITS);
  scratchCanvas.height = Math.floor(size.height * PRINT_UNITS);

  const ctx = scratchCanvas.getContext("2d")!;
  ctx.save();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  ctx.restore();

  return Promise.all([
    pdfDocument.getPage(pageNumber),
    printAnnotationStoragePromise,
  ]).then(function ([pdfPage, printAnnotationStorage]) {
    const renderContext = {
      canvasContext: ctx,
      transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
      viewport: pdfPage.getViewport({ scale: 1, rotation: size.rotation }),
      intent: "print",
      annotationMode: AnnotationMode.ENABLE_STORAGE,
      optionalContentConfigPromise,
      printAnnotationStorage,
    } as Parameters<PDFPageProxy["render"]>[0];
    const renderTask = pdfPage.render(renderContext);

    return renderTask.promise.catch(reason => {
      if (!(reason instanceof RenderingCancelledException)) {
        console.error(reason);
      }
      throw reason;
    });
  });
}

export type PDFPrintServiceOptions = {
  pdfDocument: PDFDocumentProxy;
  pagesOverview: any[];
  printContainer: HTMLElement;
  printResolution: number;
  optionalContentConfigPromise: Promise<OptionalContentConfig> | null;
  printAnnotationStoragePromise: Promise<PDFDocumentProxy["annotationStorage"]> | null;
}

class PDFPrintService {
  pdfDocument: PDFDocumentProxy;
  pagesOverview: { width: number, height: number, rotation: number }[];
  printContainer: HTMLElement;
  _printResolution: number;
  _optionalContentConfigPromise: Promise<OptionalContentConfig>;
  _printAnnotationStoragePromise: Promise<PDFDocumentProxy["annotationStorage"] | void>;
  currentPage: number;
  scratchCanvas: HTMLCanvasElement;
  pageStyleSheet: HTMLStyleElement | null;

  constructor({
    pdfDocument,
    pagesOverview,
    printContainer,
    printResolution,
    printAnnotationStoragePromise = null,
  }: PDFPrintServiceOptions) {
    this.pdfDocument = pdfDocument;
    this.pagesOverview = pagesOverview;
    this.printContainer = printContainer;
    this._printResolution = printResolution || 150;
    this._optionalContentConfigPromise = pdfDocument.getOptionalContentConfig({
      intent: "print",
    });
    this._printAnnotationStoragePromise =
      printAnnotationStoragePromise || Promise.resolve();
    this.currentPage = -1;
    // The temporary canvas where renderPage paints one page at a time.
    this.scratchCanvas = document.createElement("canvas");
  }

  layout() {
    this.throwIfInactive();

    const body = document.querySelector("body")!;
    body.setAttribute("data-pdfjsprinting", 'true');

    const { width, height } = this.pagesOverview[0];
    const hasEqualPageSizes = this.pagesOverview.every(
      size => size.width === width && size.height === height
    );
    if (!hasEqualPageSizes) {
      console.warn(
        "Not all pages have the same size. The printed result may be incorrect!"
      );
    }

    // Insert a @page + size rule to make sure that the page size is correctly
    // set. Note that we assume that all pages have the same size, because
    // variable-size pages are not supported yet (e.g. in Chrome & Firefox).
    // TODO(robwu): Use named pages when size calculation bugs get resolved
    // (e.g. https://crbug.com/355116) AND when support for named pages is
    // added (http://www.w3.org/TR/css3-page/#using-named-pages).
    // In browsers where @page + size is not supported, the next stylesheet
    // will be ignored and the user has to select the correct paper size in
    // the UI if wanted.
    this.pageStyleSheet = document.createElement("style");
    this.pageStyleSheet.textContent = `@page { size: ${width}pt ${height}pt;}`;
    body.append(this.pageStyleSheet);
  }

  destroy() {
    if (activeService !== this) {
      // |activeService| cannot be replaced without calling destroy() first,
      // so if it differs then an external consumer has a stale reference to us.
      return;
    }
    this.printContainer.textContent = "";

    const body = document.querySelector("body")!;
    body.removeAttribute("data-pdfjsprinting");

    if (this.pageStyleSheet) {
      this.pageStyleSheet.remove();
      this.pageStyleSheet = null;
    }
    this.scratchCanvas.width = this.scratchCanvas.height = 0;
    this.scratchCanvas = null!;
    activeService = null;
  }

  renderPages(renderProgress: (status: { index: number, total: number }) => void) {
    if (this.pdfDocument.isPureXfa) {
      getXfaHtmlForPrinting(this.printContainer, this.pdfDocument);
      return Promise.resolve();
    }

    const pageCount = this.pagesOverview.length;
    const renderNextPage = (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
      this.throwIfInactive();
      if (++this.currentPage >= pageCount) {
        renderProgress({ index: pageCount, total: pageCount });
        resolve();
        return;
      }
      const index = this.currentPage;
      renderProgress({ index, total: pageCount });
      renderPage(
        this,
        this.pdfDocument,
        /* pageNumber = */ index + 1,
        this.pagesOverview[index],
        this._printResolution,
        this._optionalContentConfigPromise,
        this._printAnnotationStoragePromise
      )
        .then(this.useRenderedPage.bind(this))
        .then(function () {
          renderNextPage(resolve, reject);
        }, reject);
    };
    return new Promise(renderNextPage);
  }

  useRenderedPage() {
    this.throwIfInactive();
    const img = document.createElement("img");
    this.scratchCanvas!.toBlob(blob => {
      img.src = URL.createObjectURL(blob!);
    });

    const wrapper = document.createElement("div");
    wrapper.className = "printedPage";
    wrapper.append(img);
    this.printContainer.append(wrapper);

    const { promise, resolve, reject } = Promise.withResolvers();
    img.onload = resolve;
    img.onerror = reject;

    promise
      .catch(() => {
        // Avoid "Uncaught promise" messages in the console.
      })
      .then(() => {
        URL.revokeObjectURL(img.src);
      });
    return promise;
  }

  performPrint() {
    this.throwIfInactive();
    return new Promise<void>((resolve) => {
      // Push window.print in the macrotask queue to avoid being affected by
      // the deprecation of running print() code in a microtask, see
      // https://github.com/mozilla/pdf.js/issues/7547.
      setTimeout(() => {
        if (!this.active) {
          resolve();
          return;
        }
        window.print();
        // Delay promise resolution in case print() was not synchronous.
        setTimeout(resolve, 20); // Tidy-up.
      }, 0);
    });
  }

  get active() {
    return this === activeService;
  }

  throwIfInactive() {
    if (!this.active) {
      throw new Error("This print request was cancelled or completed.");
    }
  }
}

/**
 * @implements {IPDFPrintServiceFactory}
 */
const PDFPrintServiceFactory = {
  instance: {
    supportsPrinting: true,
    createPrintService(params: PDFPrintServiceOptions) {
      if (activeService) {
        throw new Error("The print service is created and active.");
      }
      return (activeService = new PDFPrintService(params));
    }
  }
};

export { PDFPrintService, PDFPrintServiceFactory };
