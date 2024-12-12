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
  getXfaPageViewport,
  PDFDocumentProxy,
  PDFPageProxy,
  
} from "pdfjs-dist";
import {
  SimpleLinkService,
  XfaLayerBuilder,
  GenericL10n
} from "pdfjs-dist/web/pdf_viewer.mjs";
import { IL10n } from "pdfjs-dist/types/web/pdf_viewer";
import { OverlayManager } from "./overlay_manager";

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
  
      builder.render(viewport, "print");
      page.append(builder.div!);
    }
  }

let activeService: PDFPrintService | null = null;
let dialog: any = null;
let overlayManager: any = new OverlayManager();

// Renders the page to the canvas of the given print service, and returns
// the suggested dimensions of the output page.
function renderPage(
  activeServiceOnEntry: any,
  pdfDocument: PDFDocumentProxy,
  pageNumber: number,
  size: { width: number; height: number; rotation: number },
  printResolution: number,
  optionalContentConfigPromise: Awaited<
    ReturnType<PDFDocumentProxy["getOptionalContentConfig"]>
  >,
  printAnnotationStoragePromise: PDFDocumentProxy["annotationStorage"]
) {
  const scratchCanvas = activeService!.scratchCanvas;

  // The size of the canvas in pixels for printing.
  const PRINT_UNITS = printResolution / PixelsPerInch.PDF;
  scratchCanvas!.width = Math.floor(size.width * PRINT_UNITS);
  scratchCanvas!.height = Math.floor(size.height * PRINT_UNITS);

  const ctx = scratchCanvas!.getContext("2d")!;
  ctx.save();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, scratchCanvas!.width, scratchCanvas!.height);
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
    } as unknown as Parameters<PDFPageProxy["render"]>[number];
    return pdfPage.render(renderContext).promise;
  });
}

class PDFPrintService {
  pdfDocument: PDFDocumentProxy;
  pagesOverview: any;
  printContainer: HTMLElement;
  _printResolution: number;
  _optionalContentConfigPromise: any; //  = optionalContentConfigPromise || pdfDocument.getOptionalContentConfig();
  _printAnnotationStoragePromise: any; // printAnnotationStoragePromise || Promise.resolve();
  l10n: IL10n;
  currentPage: number;
  scratchCanvas: HTMLCanvasElement | null;
  pageStyleSheet: HTMLStyleElement | null;

  constructor(
    pdfDocument: PDFDocumentProxy,
    pagesOverview: any,
    printContainer: HTMLElement,
    printResolution: number,
    optionalContentConfigPromise = null,
    printAnnotationStoragePromise = null,
    l10n: IL10n
  ) {
    this.pdfDocument = pdfDocument;
    this.pagesOverview = pagesOverview;
    this.printContainer = printContainer;
    this._printResolution = printResolution || 150;
    this._optionalContentConfigPromise =
      optionalContentConfigPromise || pdfDocument.getOptionalContentConfig();
    this._printAnnotationStoragePromise =
      printAnnotationStoragePromise || Promise.resolve();
    this.l10n = l10n;
    this.currentPage = -1;
    // The temporary canvas where renderPage paints one page at a time.
    this.scratchCanvas = document.createElement("canvas");
  }

  layout() {
    this.throwIfInactive();

    const body = document.querySelector("body");
    body?.setAttribute("data-pdfjsprinting", "true");

    const hasEqualPageSizes = this.pagesOverview.every((size: any) => {
      return (
        size.width === this.pagesOverview[0].width &&
        size.height === this.pagesOverview[0].height
      );
    }, this);
    if (!hasEqualPageSizes) {
      console.warn(
        "Not all pages have the same size. The printed " +
          "result may be incorrect!"
      );
    }

    // Insert a @page + size rule to make sure that the page size is correctly
    // set. Note that we assume that all pages have the same size, because
    // variable-size pages are not supported yet (e.g. in Chrome & Firefox).
    // TODO(robwu): Use named pages when size calculation bugs get resolved
    // (e.g. https://crbug.com/355116) AND when support for named pages is
    // added (http://www.w3.org/TR/css3-page/#using-named-pages).
    // In browsers where @page + size is not supported (such as Firefox,
    // https://bugzil.la/851441), the next stylesheet will be ignored and the
    // user has to select the correct paper size in the UI if wanted.
    this.pageStyleSheet = document.createElement("style");
    const pageSize = this.pagesOverview[0];
    this.pageStyleSheet.textContent =
      "@page { size: " + pageSize.width + "pt " + pageSize.height + "pt;}";
    body?.append(this.pageStyleSheet);
  }

  destroy() {
    if (activeService !== this) {
      // |activeService| cannot be replaced without calling destroy() first,
      // so if it differs then an external consumer has a stale reference to us.
      return;
    }
    this.printContainer.textContent = "";

    const body = document.querySelector("body");
    body?.removeAttribute("data-pdfjsprinting");

    if (this.pageStyleSheet) {
      this.pageStyleSheet.remove();
      this.pageStyleSheet = null;
    }
    this.scratchCanvas!.width = this.scratchCanvas!.height = 0;
    this.scratchCanvas = null;
    activeService = null;
    ensureOverlay().then(function () {
      if (overlayManager.active === dialog) {
        overlayManager.close(dialog);
      }
    });
  }

  renderPages() {
    if (this.pdfDocument.isPureXfa) {
      getXfaHtmlForPrinting(this.printContainer, this.pdfDocument);
      return Promise.resolve();
    }

    const pageCount = this.pagesOverview.length;
    const renderNextPage = (
      resolve: (value?: unknown) => void,
      reject: (reason?: any) => void
    ) => {
      this.throwIfInactive();
      if (++this.currentPage >= pageCount) {
        renderProgress(pageCount, pageCount, this.l10n);
        resolve();
        return;
      }
      const index = this.currentPage;
      renderProgress(index, pageCount, this.l10n);
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
    const scratchCanvas = this.scratchCanvas;
    if ("toBlob" in scratchCanvas!) {
      scratchCanvas.toBlob(function (blob) {
        img.src = URL.createObjectURL(blob!);
      });
    } else {
      img.src = scratchCanvas!.toDataURL();
    }

    const wrapper = document.createElement("div");
    wrapper.className = "printedPage";
    wrapper.append(img);
    this.printContainer.append(wrapper);

    return new Promise(function (resolve, reject) {
      img.onload = resolve;
      img.onerror = reject;
    });
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
        print.call(window);
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

const print = window.print;
window.print = function () {
  if (activeService) {
    console.warn("Ignored window.print() because of a pending print job.");
    return;
  }
  ensureOverlay().then(function () {
    if (activeService) {
      overlayManager.open(dialog);
    }
  });

  try {
    dispatchEvent("beforeprint");
  } finally {
    if (!activeService) {
      console.error("Expected print service to be initialized.");
      ensureOverlay().then(function () {
        if (overlayManager.active === dialog) {
          overlayManager.close(dialog);
        }
      });
      return; // eslint-disable-line no-unsafe-finally
    }
    const activeServiceOnEntry = activeService;
    (activeService as PDFPrintService)
      .renderPages()
      .then(function () {
        return (activeServiceOnEntry as PDFPrintService).performPrint();
      })
      .catch(function () {
        // Ignore any error messages.
      })
      .then(function () {
        // aborts acts on the "active" print request, so we need to check
        // whether the print request (activeServiceOnEntry) is still active.
        // Without the check, an unrelated print request (created after aborting
        // this print request while the pages were being generated) would be
        // aborted.
        if ((activeServiceOnEntry as PDFPrintService).active) {
          abort();
        }
      });
  }
};

function dispatchEvent(eventType: string) {
  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(eventType, false, false, "custom");
  window.dispatchEvent(event);
}

function abort() {
  if (activeService) {
    activeService.destroy();
    dispatchEvent("afterprint");
  }
}

function renderProgress(index: number, total: number, l10n: any) {
  dialog ||= document.getElementById("printServiceDialog");
  const progress = Math.round((100 * index) / total);
  const progressBar = dialog.querySelector("progress");
  const progressPerc = dialog.querySelector(".relative-progress");
  progressBar.value = progress;
  l10n.get("print_progress_percent", { progress }).then((msg: string) => {
    progressPerc.textContent = msg;
  });
}

window.addEventListener(
  "keydown",
  function (event) {
    // Intercept Cmd/Ctrl + P in all browsers.
    // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
    if (
      event.keyCode === /* P= */ 80 &&
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      !event.shiftKey // (!event.shiftKey || window.chrome || window.opera)
    ) {
      window.print();

      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);

if ("onbeforeprint" in window) {
  // Do not propagate before/afterprint events when they are not triggered
  // from within this polyfill. (FF / Chrome 63+).
  const stopPropagationIfNeeded = function (event: Event) {
    if ((<any>event).detail !== "custom") {
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("beforeprint", stopPropagationIfNeeded);
  window.addEventListener("afterprint", stopPropagationIfNeeded);
}

let overlayPromise: Promise<void>;
function ensureOverlay() {
  if (!overlayPromise) {
    if (!overlayManager) {
      throw new Error("The overlay manager has not yet been initialized.");
    }
    dialog ||= document.getElementById("printServiceDialog");

    overlayPromise = overlayManager.register(
      dialog,
      /* canForceClose = */ true
    );

    document!.getElementById("printCancel")!.onclick = abort;
    dialog.addEventListener("close", abort);
  }
  return overlayPromise;
}

const PDFPrintServiceFactory = {
  instance: {
    supportsPrinting: true,
    createPrintService(
      pdfDocument: PDFDocumentProxy,
      pagesOverview: any,
      printContainer: HTMLElement,
      printResolution: number,
      optionalContentConfigPromise: any,
      printAnnotationStoragePromise: any,
      l10n: any
    ) {
      if (activeService) {
        throw new Error("The print service is created and active.");
      }
      activeService = new PDFPrintService(
        pdfDocument,
        pagesOverview,
        printContainer,
        printResolution,
        optionalContentConfigPromise,
        printAnnotationStoragePromise,
        l10n
      );
      return activeService;
    },
  },
};

export { PDFPrintService, PDFPrintServiceFactory };
